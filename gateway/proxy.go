package main

import (
	"fmt"
	"io"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
)

type Proxy struct {
	lb     *LoadBalancer
	client *fasthttp.Client
}

func NewProxy(lb *LoadBalancer) *Proxy {
	c := &fasthttp.Client{ReadTimeout: BackendTimeout, WriteTimeout: BackendTimeout}
	return &Proxy{lb: lb, client: c}
}

func copyHeaders(src *fasthttp.RequestHeader, dst *fasthttp.RequestHeader) {
	src.VisitAll(func(k, v []byte) {
		dst.SetCanonical(k, v)
	})
}

func (p *Proxy) Handle(c *fiber.Ctx) error {
	backend := p.lb.NextBackend()
	if backend == nil {
		return c.Status(fiber.StatusServiceUnavailable).SendString("no backend available")
	}
	req := fasthttp.AcquireRequest()
	resp := fasthttp.AcquireResponse()
	defer fasthttp.ReleaseRequest(req)
	defer fasthttp.ReleaseResponse(resp)
	target := fmt.Sprintf("%s%s", backend.URL, c.OriginalURL())
	req.SetRequestURI(target)
	req.Header.SetMethod(string(c.Context().Method()))
	copyHeaders(&c.Context().Request.Header, &req.Header)
	clientIP := c.IP()
	if clientIP == "" {
		clientIP = "unknown"
	}
	req.Header.Add("X-Forwarded-For", clientIP)
	if c.Request().Body() != nil && len(c.Request().Body()) > 0 {
		req.SetBody(c.Request().Body())
	}
	start := time.Now()
	if err := p.client.Do(req, resp); err != nil {
		backend.setAlive(false)
		backend.lastError = time.Now()
		log.Printf("[proxy] error %s: %v", backend.URL, err)
		return c.Status(fiber.StatusBadGateway).SendString("backend error")
	}
	latency := time.Since(start)
	c.Status(resp.StatusCode())
	resp.Header.VisitAll(func(k, v []byte) {
		c.Set(string(k), string(v))
	})
	body := resp.Body()
	if len(body) > 0 {
		_, err := c.Response().BodyWriter().Write(body)
		if err != nil {
			return err
		}
	} else {
		io.Copy(c.Response().BodyWriter(), resp.BodyStream())
	}
	c.Set("X-Proxy-Latency", latency.String())
	c.Set("X-Proxy-Backend", backend.URL)
	return nil
}

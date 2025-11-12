package main

import (
	"log"
	"time"

	"github.com/valyala/fasthttp"
)

func startHealthChecks(lb *LoadBalancer) {
	client := &fasthttp.Client{ReadTimeout: BackendTimeout, WriteTimeout: BackendTimeout}
	ticker := time.NewTicker(BackendHealthFreq)
	go func() {
		for range ticker.C {
			for _, be := range lb.Backends() {
				go func(b *Backend) {
					req := fasthttp.AcquireRequest()
					resp := fasthttp.AcquireResponse()
					defer fasthttp.ReleaseRequest(req)
					defer fasthttp.ReleaseResponse(resp)
					req.SetRequestURI(b.URL + "/health")
					req.Header.SetMethod("GET")
					if err := client.Do(req, resp); err != nil {
						b.setAlive(false)
						log.Printf("[health] %s down: %v", b.URL, err)
						return
					}
					if resp.StatusCode() >= 200 && resp.StatusCode() < 500 {
						b.setAlive(true)
					} else {
						b.setAlive(false)
						log.Printf("[health] %s unhealthy %d", b.URL, resp.StatusCode())
					}
				}(be)
			}
		}
	}()
}

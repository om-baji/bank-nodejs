package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New(fiber.Config{IdleTimeout: 10 * time.Second})
	lb := NewLoadBalancer()
	startHealthChecks(lb)
	proxy := NewProxy(lb)
	ipLimiter := NewIPRateLimiter(RateLimitRPS, RateLimitBurst)
	app.Use(func(c *fiber.Ctx) error {
		ip := c.IP()
		if ip == "" {
			ip = "unknown"
		}
		if !ipLimiter.Allow(ip) {
			return c.Status(fiber.StatusTooManyRequests).SendString("rate limit exceeded")
		}
		return c.Next()
	})
	app.All("/*", func(c *fiber.Ctx) error {
		return proxy.Handle(c)
	})
	go func() {
		log.Printf("Proxy listening on %s -> %d-%d", ListenAddr, BackendBasePort, BackendBasePort+BackendCount-1)
		if err := app.Listen(ListenAddr); err != nil {
			log.Fatalf("start failed: %v", err)
		}
	}()
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	<-sig
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	app.ShutdownWithContext(ctx)
}

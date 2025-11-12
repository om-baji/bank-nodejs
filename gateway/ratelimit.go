package main

import (
	"net"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type IPRateLimiter struct {
	clients sync.Map
	rps     int
	burst   int
}

func NewIPRateLimiter(rps, burst int) *IPRateLimiter {
	rl := &IPRateLimiter{clients: sync.Map{}, rps: rps, burst: burst}
	go rl.cleanupLoop()
	return rl
}

func (r *IPRateLimiter) getLimiter(ip string) *rate.Limiter {
	if v, ok := r.clients.Load(ip); ok {
		return v.(*rate.Limiter)
	}
	limiter := rate.NewLimiter(rate.Limit(r.rps), r.burst)
	r.clients.Store(ip, limiter)
	return limiter
}

func (r *IPRateLimiter) Allow(ip string) bool {
	limiter := r.getLimiter(ip)
	return limiter.Allow()
}

func (r *IPRateLimiter) cleanupLoop() {
	for range time.Tick(5 * time.Minute) {
		r.clients.Range(func(k, v interface{}) bool {
			return true
		})
	}
}

func getIP(remoteAddr string) string {
	ip, _, err := net.SplitHostPort(remoteAddr)
	if err != nil {
		return remoteAddr
	}
	return ip
}

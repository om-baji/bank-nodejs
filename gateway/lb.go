package main

import (
	"fmt"
	"sync"
	"time"
)

type Backend struct {
	URL       string
	Alive     bool
	lastError time.Time
	mutex     sync.RWMutex
}

func (b *Backend) setAlive(alive bool) {
	b.mutex.Lock()
	defer b.mutex.Unlock()
	b.Alive = alive
}

func (b *Backend) isAlive() bool {
	b.mutex.RLock()
	defer b.mutex.RUnlock()
	return b.Alive
}

type LoadBalancer struct {
	backends []*Backend
	idx      int
	mutex    sync.Mutex
}

func NewLoadBalancer() *LoadBalancer {
	b := &LoadBalancer{backends: make([]*Backend, 0, BackendCount)}
	for i := 0; i < BackendCount; i++ {
		port := BackendBasePort + i
		url := fmt.Sprintf("http://127.0.0.1:%d", port)
		backend := &Backend{URL: url, Alive: true}
		b.backends = append(b.backends, backend)
	}
	return b
}

func (lb *LoadBalancer) NextBackend() *Backend {
	lb.mutex.Lock()
	defer lb.mutex.Unlock()
	n := len(lb.backends)
	for i := 0; i < n; i++ {
		lb.idx = (lb.idx + 1) % n
		candidate := lb.backends[lb.idx]
		if candidate.isAlive() {
			return candidate
		}
	}
	return nil
}

func (lb *LoadBalancer) Backends() []*Backend {
	return lb.backends
}

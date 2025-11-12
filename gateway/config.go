package main

import "time"

const (
	ListenAddr        = ":8080"
	BackendBasePort   = 3000
	BackendCount      = 5
	BackendHealthFreq = 5 * time.Second
	BackendTimeout    = 2 * time.Second
)

var (
	RateLimitRPS   = 5
	RateLimitBurst = 10
)

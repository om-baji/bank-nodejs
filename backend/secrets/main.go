package main

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"golang.org/x/crypto/argon2"
	"golang.org/x/crypto/scrypt"

	"github.com/redis/go-redis/v9"
)

type StoredSecret struct {
	ID        string            `json:"id"`
	Plain     string            `json:"plain,omitempty"`
	ArgonHash string            `json:"argon_hash,omitempty"`
	Enc       string            `json:"enc,omitempty"`
	IV        string            `json:"iv,omitempty"`
	CreatedAt int64             `json:"created_at"`
	ExpiresAt int64             `json:"expires_at,omitempty"`
	Algo      string            `json:"algo"`
	Meta      map[string]string `json:"meta,omitempty"`
}

func randBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	return b, err
}

func genSecretBytes(n int) (string, error) {
	b, err := randBytes(n)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func argon2idHash(secret string, salt []byte, mem uint32, timeCost uint32, threads uint8, keyLen uint32) string {
	hash := argon2.IDKey([]byte(secret), salt, timeCost, mem, threads, keyLen)
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)
	params := fmt.Sprintf("m=%d,t=%d,p=%d", mem, timeCost, threads)
	return fmt.Sprintf("$argon2id$%s$%s$%s", params, b64Salt, b64Hash)
}

func deriveAESKey(sharedKey string) ([]byte, error) {
	salt := sha256.Sum256([]byte("aes-key-derivation-salt"))
	dk, err := scrypt.Key([]byte(sharedKey), salt[:], 1<<15, 8, 1, 32)
	if err != nil {
		return nil, err
	}
	return dk, nil
}

func aesGCMEncrypt(plaintext string, sharedKey string) (cipherTextB64 string, ivB64 string, err error) {
	key, err := deriveAESKey(sharedKey)
	if err != nil {
		return "", "", err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", "", err
	}
	iv, err := randBytes(gcm.NonceSize())
	if err != nil {
		return "", "", err
	}
	ct := gcm.Seal(nil, iv, []byte(plaintext), nil)
	return base64.RawStdEncoding.EncodeToString(ct), base64.RawStdEncoding.EncodeToString(iv), nil
}

func connectRedis(redisURL string) (*redis.Client, error) {
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, err
	}
	client := redis.NewClient(opt)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}
	return client, nil
}

func pushSecret(ctx context.Context, rdb *redis.Client, key string, s StoredSecret, ttl time.Duration) error {
	j, err := json.Marshal(s)
	if err != nil {
		return err
	}
	if ttl > 0 {
		return rdb.Set(ctx, key, j, ttl).Err()
	}
	return rdb.Set(ctx, key, j, 0).Err()
}

func nowUnix() int64 { return time.Now().Unix() }

func main() {
	redisURL := flag.String("redis", os.Getenv("REDIS_URL"), "")
	prefix := flag.String("prefix", "secrets", "")
	rotateIntervalS := flag.Int("interval", 3600, "")
	sharedKey := flag.String("shared-key", os.Getenv("SHARED_KEY"), "")
	secretLen := flag.Int("len", 32, "")
	argonMem := flag.Uint("argon-m", 65536, "")
	argonTime := flag.Uint("argon-t", 3, "")
	argonThreads := flag.Uint("argon-p", 2, "")
	argonKeyLen := flag.Uint("argon-l", 32, "")
	ttlS := flag.Int("ttl", 0, "")
	once := flag.Bool("once", false, "")
	flag.Parse()

	if *redisURL == "" {
		fmt.Fprintln(os.Stderr, "REDIS_URL not provided")
		os.Exit(2)
	}

	rdb, err := connectRedis(*redisURL)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(2)
	}

	interval := time.Duration(*rotateIntervalS) * time.Second
	ttl := time.Duration(*ttlS) * time.Second

	ctx := context.Background()

	generateAndPush := func(id string) error {
		plain, err := genSecretBytes(*secretLen)
		if err != nil {
			return err
		}
		salt, err := randBytes(16)
		if err != nil {
			return err
		}
		argon := argon2idHash(plain, salt, uint32(*argonMem), uint32(*argonTime), uint8(*argonThreads), uint32(*argonKeyLen))
		var enc, iv string
		if strings.TrimSpace(*sharedKey) != "" {
			enc, iv, err = aesGCMEncrypt(plain, *sharedKey)
			if err != nil {
				return err
			}
		}
		s := StoredSecret{
			ID:        id,
			Plain:     "",
			ArgonHash: argon,
			Enc:       enc,
			IV:        iv,
			CreatedAt: nowUnix(),
			ExpiresAt: 0,
			Algo:      "argon2id+aes-gcm",
			Meta: map[string]string{
				"len": strconv.Itoa(*secretLen),
			},
		}
		if ttl > 0 {
			s.ExpiresAt = time.Now().Add(ttl).Unix()
		}
		redisKey := fmt.Sprintf("%s:%s", *prefix, id)
		return pushSecret(ctx, rdb, redisKey, s, ttl)
	}

	rotateOnce := func() error {
		idb, err := genSecretBytes(8)
		if err != nil {
			return err
		}
		id := fmt.Sprintf("sec-%s", idb)
		return generateAndPush(id)
	}

	if *once {
		if err := rotateOnce(); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		fmt.Println("rotated once")
		return
	}

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		idb, err := genSecretBytes(8)
		if err == nil {
			id := fmt.Sprintf("sec-%s", idb)
			_ = generateAndPush(id)
		}
		<-ticker.C
	}
}

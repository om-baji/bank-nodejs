import Redis from 'ioredis';

class RedisCache {
    private static instance: Redis | null = null;

    public static getInstance(): Redis {
        if (!RedisCache.instance) {
            RedisCache.instance = new Redis({
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: Number(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
                db: Number(process.env.REDIS_DB) || 0,
            });
        }
        return RedisCache.instance;
    }
}

const redis = RedisCache.getInstance()

export default redis;
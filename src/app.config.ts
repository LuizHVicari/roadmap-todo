import { registerAs } from "@nestjs/config";

export default registerAs('app', () => ({
    database: {
        type: process.env.DB_TYPE as 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: Boolean(process.env.DB_AUTO_LOAD_ENTITIES),
        synchronize: Boolean(process.env.DB_SYNCHRONIZE)
    },
    throttling: {
        ttl: Number(process.env.THROTTLE_TTL),
        limit: Number(process.env.THROTTLE_LIMIT)
    },
    environment: process.env.NODE_ENV || 'production',
}))
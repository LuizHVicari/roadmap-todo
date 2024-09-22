import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () =>( {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTTL: process.env.JWT_REFRESH_TTL,
    expiresIn: process.env.JWT_EXPIRES_IN
}))
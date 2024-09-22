export const jwtConstants = {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTTL: process.env.JWT_REFRESH_TTL
}

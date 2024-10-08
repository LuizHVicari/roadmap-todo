import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService, TokenExpiredError } from '@nestjs/jwt'
import jwtConfig from './jwt.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtSettings: ConfigType<typeof jwtConfig>,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email })

        // todo hash password
        if (user && user.password == password) {
            const result = user
            delete result['password']
            return result
        }
        return null
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign({sub: user}, {
                secret: this.jwtSettings.refreshSecret, 
                expiresIn: this.jwtSettings.refreshTTL
            })
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.jwtSettings.refreshSecret
            })
            const userId = payload.sub.id

            const user = await this.userRepository.findOneBy({id:userId, active: true})
            if (!user) {
                throw new UnauthorizedException()
            }
            const newTokenPayload = { email: user.email, sub: user.id}
            return {access_token: this.jwtService.sign(newTokenPayload)}

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException()
            }
            throw error
        }
    }
}

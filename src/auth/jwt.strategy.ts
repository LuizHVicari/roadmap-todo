import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'
import { TokenPayloadDto } from './dto/token-payload.dto'
import jwtConfig from './jwt.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(jwtConfig.KEY)
        private readonly jwtSettings: ConfigType<typeof jwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSettings.secret,
        })
    }

    async validate(payload: TokenPayloadDto) {
        const { sub, email } = payload
        const user = await this.userRepository.findOneBy({ id: sub })
        if (user && user.active) {
            return {
                id: sub,
                email,
            }
        }

        throw new UnauthorizedException()
    }
}

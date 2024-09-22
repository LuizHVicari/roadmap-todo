import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from './constants'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'
import { TokenPayloadDto } from './dto/token-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
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

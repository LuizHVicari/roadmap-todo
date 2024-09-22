import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { jwtConstants } from "./constants";

@Injectable()
class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.refreshSecret
        })
    }

    async validate(payload: any) {
        const authUser = await this.userRepository.findOne(payload.sub)
        if (!authUser) {
            throw new UnauthorizedException()
        }

        return {
            attibutes: authUser,
            refreshTokenExpiresAt: new Date(payload.exp * 1000)
        }
    }
}
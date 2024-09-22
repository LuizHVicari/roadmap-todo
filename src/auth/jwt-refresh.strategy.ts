import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import jwtConfig from "./jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor (
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(jwtConfig.KEY)
        private readonly jwtSettings: ConfigType<typeof jwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSettings.refreshSecret
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
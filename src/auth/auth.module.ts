import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { LocalStrategy } from './local.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { ConfigModule, ConfigType } from '@nestjs/config'
import jwtConfig from './jwt.config'

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync({
            imports: [ConfigModule.forFeature(jwtConfig)],
            inject: [ jwtConfig.KEY],
            useFactory: async (jwtSettings: ConfigType<typeof jwtConfig> ) => {
                return {
                    secret: jwtSettings.secret,
                    signOptions: {
                        expiresIn: jwtSettings.expiresIn
                    }
                }
                
            },
        }),
    ],
})
export class AuthModule {}

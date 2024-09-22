import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoModule } from './todo/todo.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigType } from '@nestjs/config'
import appConfig from './app.config'

@Module({
    imports: [
        AuthModule,
        UsersModule,
        TodoModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [appConfig.KEY],
            useFactory: async (appSettings: ConfigType<typeof appConfig>) => {
                return {
                    type: appSettings.database.type,
                    host: appSettings.database.host,
                    port: appSettings.database.port,
                    username: appSettings.database.username,
                    password: appSettings.database.password,
                    database: appSettings.database.database,
                    autoLoadEntities: appSettings.database.autoLoadEntities,
                    synchronize: appSettings.database.synchronize,
                }
            },
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [appConfig.KEY],
            useFactory: async (appSettings: ConfigType<typeof appConfig>) => [
            {
                ttl: appSettings.throttling.ttl,
                limit: appSettings.throttling.limit,
            },
        ]}),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
})
export class AppModule {}

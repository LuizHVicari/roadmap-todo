import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TodoModule } from './todo/todo.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
    imports: [
        AuthModule,
        UsersModule,
        TodoModule,
        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                return {
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'postgres',
                    password: 'postgres',
                    database: 'todo',
                    autoLoadEntities: true,
                    synchronize: true,
                }
            },
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100
        }])
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

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'



async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(helmet())
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,            
        }),
    )
    app.enableCors({
        origin: 'http://localhost:3001'
    })
    await app.listen(3000)
}
bootstrap()

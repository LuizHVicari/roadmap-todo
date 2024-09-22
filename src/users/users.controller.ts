import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
    Request as Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Request } from 'express'
import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findOne(@Req() request: Request) {
        return await this.usersService.findOne(request.user as User)
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(request.user as User, updateUserDto)
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    async remove(@Req() request: Request) {
        return await this.usersService.remove(request.user as User)
    }
}

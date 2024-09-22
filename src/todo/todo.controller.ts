import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request as Req,
    Query,
    ValidationPipe,
    UsePipes,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { TodoService } from './todo.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Request } from 'express'
import { User } from 'src/users/entities/user.entity'
import { PaginationDto } from 'src/commom/dto/pagination.dto'
import { TodoFilteringPaginationDto } from './dto/todo-filtering-pagination.dto'

@UseGuards(JwtAuthGuard)
@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post()
    async create(@Req() request: Request, @Body() createTodoDto: CreateTodoDto) {
        return await this.todoService.create(request.user as User, createTodoDto)
    }

    @Get()
    @UsePipes(new ValidationPipe({ whitelist: false, transform: true}))
    async findAll(
        @Req() request: Request, 
        @Query() paginationFilteringDto: TodoFilteringPaginationDto 
    ) {
        return await this.todoService.findAll(request.user as User, paginationFilteringDto)
    }

    @Get(':id')
    async findOne(@Req() request: Request, @Param('id', ParseUUIDPipe) id: string) {
        return await this.todoService.findOne(request.user as User, id)
    }

    @Patch(':id')
    async update(@Req() request: Request, @Param('id', ParseUUIDPipe) id: string, @Body() updateTodoDto: UpdateTodoDto) {
        return await this.todoService.update(request.user as User, id, updateTodoDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Req() request: Request, @Param('id', ParseUUIDPipe) id: string) {
        return await this.todoService.remove(request.user as User, id)
    }
}

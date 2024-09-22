import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { User } from 'src/users/entities/user.entity'
import { ILike, LessThan, LessThanOrEqual, Like, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Todo } from './entities/todo.entity'
import { PaginationDto } from 'src/commom/dto/pagination.dto'
import { TodoFilteringPaginationDto } from './dto/todo-filtering-pagination.dto'

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) {}

    async create(user: User, createTodoDto: CreateTodoDto) {
        try {
            const todo = this.todoRepository.create({
                ...createTodoDto,
                user,
            })
            return await this.todoRepository.save(todo)
        } catch (error) {
            throw new BadRequestException(error)
        }
    }

    async findAll(
        user: User, 
        filterigPaginationDto: TodoFilteringPaginationDto
    ) {
        const data = await this.todoRepository.findAndCount({
            where: {
                user: user,
                completed: filterigPaginationDto?.completed,
            },
            order: {
                updatedAt: 'desc'
            },
            take: filterigPaginationDto.limit,
            skip: (filterigPaginationDto.page - 1) * filterigPaginationDto.limit,
        })


        return {
            'data': data[0],
            'page': filterigPaginationDto.page,
            'limit': filterigPaginationDto.limit,
            'total': data[1],
        }
    }

    async findOne(user: User, id: string) {
        const todo = await this.todoRepository.findOneBy({
            user,
            id
        })
        if (!todo) {
            throw new NotFoundException()
        }
        return todo
    }

    async update(user: User, id: string, updateTodoDto: UpdateTodoDto) {
        const todo = await this.findOne(user, id)
        const newTodo = {
            ...todo,
            ...updateTodoDto,
        }
        await this.todoRepository.save(newTodo)
        return newTodo
    }

    async remove(user: User, id: string) {
        const todo = await this.findOne(user, id)
        const deletedTodo = await this.todoRepository.remove(todo)
        if (!deletedTodo) {
            throw BadRequestException
        }
    }
}

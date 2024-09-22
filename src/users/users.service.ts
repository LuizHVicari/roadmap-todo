import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto)
        if (!user) throw new BadRequestException('Could not create the user')
        try {
            await this.userRepository.save(user)
            return user
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException(
                    'Could not create the user since the e-mail is not unique',
                )
            }
            throw new BadRequestException(error)
        }
    }

    findAll() {
        return this.userRepository.find()
    }

    async findOne(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    async update(user: User, updateUserDto: UpdateUserDto) {
        const updateUser = await this.userRepository.preload({
            ...user,
            ...updateUserDto,
        })
        if (!updateUser) {
            throw new NotFoundException('User not found')
        }
        return await this.userRepository.save(updateUser)
    }

    async remove(user: User) {
        const updatedUser = await this.userRepository.preload({
            ...user,
            active: false,
        })

        if (!updatedUser) {
            throw new NotFoundException('User not found')
        }

        return await this.userRepository.save(updatedUser)
    }
}

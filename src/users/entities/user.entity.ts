import { Todo } from 'src/todo/entities/todo.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column()
    name: string
    @Column({
        unique: true,
    })
    email: string
    @Column()
    password: string
    @Column({ default: true })
    active: boolean

    @OneToMany(() => Todo, todo => todo.user)
    todos: Todo[]

    @CreateDateColumn()
    createdAt: string

    @UpdateDateColumn()
    updatedAt: string
}

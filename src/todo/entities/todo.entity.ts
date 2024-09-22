import { User } from 'src/users/entities/user.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar' })
    title: string

    @Column({ type: 'text' })
    description: string

    @Column({ default: false })
    completed: boolean

    @ManyToOne(() => User, user => user.todos)
    user: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

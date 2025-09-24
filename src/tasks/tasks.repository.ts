import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async createTask({ title, description }: CreateTaskDto): Promise<Task> {
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.save(task);

        return task;
    }

    async deleteTask(id: string): Promise<DeleteResult> {
        return await this.delete(id);
    }

    async searchTasks({ searchTerm, status }: GetTasksFilterDto): Promise<Task[]> {
        const query = this.createQueryBuilder('task');

        if (searchTerm) {
            query.andWhere('task.description LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` });
            query.andWhere('task.title LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm}%` });
        }

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        return await query.getMany();
    }
}
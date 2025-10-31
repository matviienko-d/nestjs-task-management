import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    createTask({ description, title }: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask({ description, title }, user);
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.getTaskById(id, user);
        const deletedResult = await this.tasksRepository.deleteTask(id, user);

        if (!deletedResult.affected) {
           throw new NotFoundException(`Task with id ${id} not found`);
        }
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id, user } });
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return task;
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        return await this.tasksRepository.save({ ...task, status });
    }

    async searchTasks({ searchTerm, status }: GetTasksFilterDto, user: User): Promise<Task[]> {

        return await this.tasksRepository.searchTasks({ searchTerm, status }, user);
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task.model';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    // private tasks: Task[] = [
    //     {
    //         id: '1',
    //         title: 'Task 1',
    //         description: 'Description 1',
    //         status: TaskStatus.OPEN,
    //     },
    //     {
    //         id: '2',
    //         title: 'Task 2',
    //         description: 'Description 2',
    //         status: TaskStatus.IN_PROGRESS,
    //     },
    //     {
    //         id: uuid(),
    //         title: 'Task 3',
    //         description: 'Description 3',
    //         status: TaskStatus.DONE,
    //     },
    // ];

    // getAllTasks() {
    //     return this.tasks;
    // }

    createTask({ description, title }: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask({ description, title });
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.getTaskById(id);
        const deletedResult = await this.tasksRepository.deleteTask(id);

        if (!deletedResult.affected) {
           throw new NotFoundException(`Task with id ${id} not found`);
        }
    }

    // getTaskById(id: string): Task {
    //     const task = this.tasks.find(({ id: taskId }) => taskId === id);
    //     if (!task) {
    //         throw new NotFoundException(`Task with id ${id} not found`);
    //     }
    //     return task;
    // }

    async getTaskById(id: string): Promise<Task> {
        console.log(id);
        const task = await this.tasksRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return task;
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        return await this.tasksRepository.save({ ...task, status });
    }

    async searchTasks({ searchTerm, status }: GetTasksFilterDto): Promise<Task[]> {

        return await this.tasksRepository.searchTasks({ searchTerm, status });
    }
}

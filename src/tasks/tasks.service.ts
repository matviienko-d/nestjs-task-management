import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [
        {
            id: '1',
            title: 'Task 1',
            description: 'Description 1',
            status: TaskStatus.OPEN,
        },
        {
            id: '2',
            title: 'Task 2',
            description: 'Description 2',
            status: TaskStatus.IN_PROGRESS,
        },
        {
            id: uuid(),
            title: 'Task 3',
            description: 'Description 3',
            status: TaskStatus.DONE,
        },
    ];

    getAllTasks() {
        return this.tasks;
    }

    createTask({ description, title }: CreateTaskDto): Task {
        const task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        console.log(this.tasks);

        return task;
    }

    deleteTask(id: string): void {
        const taskId = this.getTaskById(id)?.id;

        this.tasks = this.tasks.filter(
            ({ id: existingTaskId }) => existingTaskId !== taskId,
        );
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find(({ id: taskId }) => taskId === id);
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus): void {
        const task = this.getTaskById(id);
        if (task) {
            task.status = status;
        }
    }

    searchTasks({ searchTerm, status }: GetTasksFilterDto): Task[] {
        let filteredTasks: Task[] = [...this.getAllTasks()];
        searchTerm = searchTerm?.trim()?.toLocaleLowerCase();

        if (searchTerm && searchTerm.length > 0) {
            filteredTasks = this.tasks.filter(
                (task: Task) =>
                    task.description.toLocaleLowerCase().includes(searchTerm) ||
                    task.title.toLocaleLowerCase().includes(searchTerm),
            );
        }
        if (status) {
            filteredTasks = filteredTasks.filter(
                ({ status: taskStatus }) => taskStatus === status,
            );
        }

        return filteredTasks;
    }
}

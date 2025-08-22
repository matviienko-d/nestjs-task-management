import { Injectable } from '@nestjs/common';
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
        this.tasks = this.tasks.filter(
            ({ id: existingTaskId }) => existingTaskId !== id,
        );
    }

    getTaskById(id: string): Task | null {
        return this.tasks.find(({ id: taskId }) => taskId === id) ?? null;
    }

    updateTaskStatus(id: string, status: TaskStatus): void {
        if (!(status in TaskStatus)) {
            return;
        }
        this.tasks = this.tasks.map((task: Task) => {
            if (task.id === id) {
                return {
                    ...task,
                    status: status,
                };
            }
            return task;
        });
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

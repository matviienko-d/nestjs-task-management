import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get('/getTask')
    getTaskById(@Query('id') id: string): Task {
        const task = this.tasksService.getTaskById(id);
        if (!task) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return task;
    }

    @Delete('/deleteTask/:taskId')
    deleteTask(@Param('taskId') id: string): void {
        this.tasksService.deleteTask(id);
    }

    @Get()
    getTasks(@Query() tasksSearchDto: GetTasksFilterDto): Task[] {
        if (Object.keys(tasksSearchDto).length === 0) {
            return this.tasksService.getAllTasks();
        }

        return this.tasksService.searchTasks(tasksSearchDto);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksService.createTask(createTaskDto);
    }

    @Patch('/updateTask/:taskId/status')
    updateTaskStatus(
        @Param('taskId') taskId: string,
        @Body() body: { status: TaskStatus },
    ): void {
        this.tasksService.updateTaskStatus(taskId, body.status);
    }
}

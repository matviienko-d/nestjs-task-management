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
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get('/getTask')
    getTaskById(@Query('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Delete('/deleteTask/:taskId')
    async deleteTask(@Param('taskId') id: string): Promise<void> {
        return await this.tasksService.deleteTask(id);
    }

    @Get()
    async getTasks(@Query() tasksSearchDto: GetTasksFilterDto): Promise<Task[]> {
        return await this.tasksService.searchTasks(tasksSearchDto);
    }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        const task = await this.tasksService.createTask(createTaskDto);
        return task;
    }

    @Patch('/updateTask/:taskId/status')
    async updateTaskStatus(
        @Param('taskId') taskId: string,
        @Body() body: UpdateTaskStatusDto,
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(taskId, body.status);
    }
}

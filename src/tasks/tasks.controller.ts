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
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Get('/getTask')
    getTaskById(@Query('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/deleteTask/:taskId')
    async deleteTask(@Param('taskId') id: string, @GetUser() user: User): Promise<void> {
        return await this.tasksService.deleteTask(id, user);
    }

    @Get()
    async getTasks(@Query() tasksSearchDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        return await this.tasksService.searchTasks(tasksSearchDto, user);
    }

    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        const task = await this.tasksService.createTask(createTaskDto, user);
        return task;
    }

    @Patch('/updateTask/:taskId/status')
    async updateTaskStatus(
        @Param('taskId') taskId: string,
        @Body() body: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(taskId, body.status, user);
    }
}

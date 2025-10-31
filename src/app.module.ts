import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TasksService } from './tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TasksModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'brodanil',
      password: 'mysql',
      database: 'brodanil_db',
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        allowPublicKeyRetrieval: true,
        ssl: false,
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}

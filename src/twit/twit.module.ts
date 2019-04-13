import { Module } from '@nestjs/common';
import { TwitController } from './twit.controller';
import { TwitService } from './twit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitEntity } from './twit.entity';
import { UserEntity } from 'src/user/user.entity';
import { CommentService } from 'src/comment/comment.service';
import { CommentEntity } from 'src/comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TwitEntity, UserEntity, CommentEntity])],
  controllers: [TwitController],
  providers: [TwitService, CommentService],
})
export class TwitModule {}

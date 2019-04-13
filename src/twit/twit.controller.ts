import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TwitService } from './twit.service';
import { TwitEntity } from './twit.entity';
import { TwitDTO } from './dto/twit.dto';
import { UpdateResult, DeleteResult } from 'typeorm';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { CommentDTO } from 'src/comment/dto/comment.dto';
import { CommentService } from 'src/comment/comment.service';
import { CommentEntity } from 'src/comment/comment.entity';

@Controller('twits')
export class TwitController {
  constructor(
    private readonly twitService: TwitService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  async allTwits(): Promise<TwitEntity[]> {
    return await this.twitService.allTwits();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User('id') userId,
    @Body() twitData: TwitDTO,
  ): Promise<TwitEntity> {
    return await this.twitService.create(userId, twitData);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async comment(
    @User('id') userId,
    @Param('id') twitId,
    @Body() commentData: CommentDTO,
  ): Promise<CommentEntity> {
    return this.commentService.create(userId, twitId, commentData);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @User('id') userId,
    @Param('id') twitId,
    @Body() twitData: TwitDTO,
  ): Promise<UpdateResult> {
    return await this.twitService.update(userId, twitId, twitData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@User('id') userId, @Param('id') twitId): Promise<DeleteResult> {
    return await this.twitService.delete(userId, twitId);
  }
}

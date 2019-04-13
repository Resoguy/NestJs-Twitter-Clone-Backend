import {
  Controller,
  Get,
  UseGuards,
  Delete,
  Param,
  Put,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentEntity } from './comment.entity';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CommentDTO } from './dto/comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async allComments(): Promise<CommentEntity[]> {
    return await this.commentService.allComments();
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @User('id') userId,
    @Param('id') commentId,
    @Body() commentData: CommentDTO,
  ): Promise<UpdateResult> {
    return await this.commentService.update(userId, commentId, commentData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @User('id') userId,
    @Param('id') commentId,
  ): Promise<DeleteResult> {
    return await this.commentService.delete(userId, commentId);
  }
}

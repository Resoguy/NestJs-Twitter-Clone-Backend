import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { TwitEntity } from 'src/twit/twit.entity';
import { CommentEntity } from './comment.entity';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TwitEntity)
    private twitRepository: Repository<TwitEntity>,
  ) {}

  async allComments(): Promise<CommentEntity[]> {
    return await this.commentRepository.find({ relations: ['user', 'twit'] });
  }

  async create(
    userId,
    twitId,
    commentData: CommentDTO,
  ): Promise<CommentEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['comments'],
    });
    if (!user)
      throw new UnauthorizedException('You must login to send a comment!');

    const twit = await this.twitRepository.findOne({
      where: { id: twitId },
      relations: ['comments'],
    });
    if (!twit) throw new BadRequestException('No such twit to comment!');

    const newComment = await this.commentRepository.create(commentData);
    user.comments.push(newComment);
    twit.comments.push(newComment);
    await this.userRepository.save(user);
    await this.twitRepository.save(twit);
    return await this.commentRepository.save(newComment);
  }

  async update(
    userId,
    commentId,
    commentData: CommentDTO,
  ): Promise<UpdateResult> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('No such comment found!');
    if (userId !== comment.user.id)
      throw new ForbiddenException('You can only update your own comments!');

    return await this.commentRepository.update(commentId, commentData);
  }

  async delete(userId, commentId): Promise<DeleteResult> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('No such comment found!');
    if (userId !== comment.user.id)
      throw new ForbiddenException('You can only delete your own comments!');

    return await this.commentRepository.delete(commentId);
  }
}

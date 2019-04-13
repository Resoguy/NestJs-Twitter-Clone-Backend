import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { TwitEntity } from 'src/twit/twit.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: false, length: 140 })
  text: string;

  @ManyToOne(type => UserEntity, user => user.comments, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(type => TwitEntity, twit => twit.comments, { onDelete: 'CASCADE' })
  twit: TwitEntity;
}

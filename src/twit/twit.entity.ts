import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity()
export class TwitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: false, length: 140 })
  text: string;

  @ManyToOne(type => UserEntity, user => user.twits, { onDelete: 'CASCADE' })
  user: UserEntity;
}

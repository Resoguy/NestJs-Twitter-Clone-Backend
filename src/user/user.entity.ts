import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TwitEntity } from 'src/twit/twit.entity';
import { CommentEntity } from 'src/comment/comment.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', default: '' })
  username: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @OneToMany(type => TwitEntity, twit => twit.user, { cascade: true })
  twits: TwitEntity[];

  @OneToMany(type => CommentEntity, comment => comment.user, { cascade: true })
  comments: CommentEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token(): string {
    return jwt.sign(
      {
        id: this.id,
        username: this.username,
        email: this.email,
      },
      'FML',
      { expiresIn: '7d' },
    );
  }

  toResponse() {
    return this.token;
  }
}

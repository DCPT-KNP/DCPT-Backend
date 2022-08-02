import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'job_groups' })
export class JobGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.jobGroups, {
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(name: string, user: User) {
    this.name = name;
    this.user = user;
  }

  static fromJson(json) {
    return new JobGroup(json.name, json.user);
  }
}

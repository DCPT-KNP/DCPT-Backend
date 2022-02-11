import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'job_groups' })
export class JobGroup {
  @PrimaryColumn({ type: 'uuid' })
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.jobGroups, {
    onDelete: 'CASCADE',
  })
  user: User;
}

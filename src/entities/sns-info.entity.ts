import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sns_info' })
export class SNSInfo {
  @PrimaryColumn()
  id: string;

  @Column()
  snsId: string;

  @Column()
  snsType: string;

  @Column()
  snsName: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  connectedDate: Date;

  @OneToOne(() => User)
  user: User;
}

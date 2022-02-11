import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'sns_info' })
export class SNSInfo {
  @PrimaryGeneratedColumn()
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
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(snsId: string, snsType: string, snsName: string) {
    this.snsId = snsId;
    this.snsType = snsType;
    this.snsName = snsName;
  }

  static fromJson(json) {
    return new SNSInfo(json.snsId, json.snsType, json.snsName);
  }
}

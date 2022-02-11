import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'career_models' })
export class CareerModel {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column({
    default: 'My Roadmap',
  })
  title: string;

  @Column()
  primaryTag: string;

  @Column()
  secondaryTag: string;

  @OneToOne(() => User)
  user: User;
}

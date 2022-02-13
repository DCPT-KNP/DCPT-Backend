import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'career_models' })
export class CareerModel {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: string;

  @Column({
    default: 'My Roadmap',
  })
  title: string;

  @Column()
  primaryTag: string;

  @Column({
    nullable: true,
  })
  secondaryTag: string;

  @OneToOne(() => User)
  user: User;

  constructor(
    type: string,
    primaryTag: string,
    user: User,
    secondaryTag?: string,
  ) {
    this.type = type;
    this.title = 'My Roadmap';
    this.primaryTag = primaryTag;
    this.secondaryTag = secondaryTag;
    this.user = user;
  }

  static fromJson(json) {
    return new CareerModel(
      json.type,
      json.primaryTag,
      json.user,
      json.secondaryTag,
    );
  }
}

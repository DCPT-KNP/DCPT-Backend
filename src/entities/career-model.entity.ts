import { ShapeType, SkillType } from '../common/custom-type';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'career_models' })
export class CareerModel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'enum',
    enum: ShapeType,
  })
  type: ShapeType;

  @Column({
    default: 'My Roadmap',
  })
  title: string;

  @Column({
    type: 'enum',
    enum: SkillType,
  })
  primaryTag: SkillType;

  @Column({
    nullable: true,
    type: 'enum',
    enum: SkillType,
  })
  secondaryTag: SkillType;

  @OneToOne(() => User)
  user: User;

  constructor(
    type: ShapeType,
    primaryTag: SkillType,
    user: User,
    secondaryTag?: SkillType,
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

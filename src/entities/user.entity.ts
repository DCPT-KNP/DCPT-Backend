import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareerModel } from './career-model.entity';
import { JobGroup } from './job-group.entity';
import { OtherCategory } from './other-category.entity';
import { SkillCard } from './skill-card.entity';
import { SNSInfo } from './sns-info.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column()
  image: string;

  @Column({
    nullable: true,
  })
  careerYear: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  modifiedDate: Date;

  @OneToOne(() => SNSInfo)
  snsInfo: SNSInfo;

  @OneToOne(() => CareerModel)
  @JoinColumn({ name: 'career_model_id' })
  careerModel: CareerModel;

  // one2many : user, skillcard
  @OneToMany(() => SkillCard, (skillCard) => skillCard.user)
  skillCards: SkillCard[];

  // one2many : user, othercategory
  @OneToMany(() => OtherCategory, (otherCategory) => otherCategory.user)
  otherCategories: OtherCategory[];

  // one2many: user, jobgroup
  @OneToMany(() => JobGroup, (jobGroup) => jobGroup.user)
  jobGroups: JobGroup[];

  constructor(
    email: string,
    nickname: string,
    image: string,
    careerYear: string | null,
  ) {
    this.email = email;
    this.nickname = nickname;
    this.image = image;
    this.careerYear = careerYear;
  }

  static fromJson(json) {
    return new User(json.email, json.nickname, json.image, json.careerYear);
  }

  addCareerModel(data) {
    this.careerModel = data;
  }
}

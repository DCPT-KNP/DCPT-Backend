import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareerModel } from './career-model.entity';
import { OtherCategory } from './other-category.entity';
import { SkillCard } from './skill-card.entity';
import { SNSInfo } from './sns-info.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

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
  @JoinColumn({ name: 'sns_info_id' })
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
}

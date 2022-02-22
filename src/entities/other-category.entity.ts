import { SkillType } from 'src/common/custom-type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'other_categories' })
export class OtherCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SkillType,
  })
  tag: SkillType;

  // many2one : user, othercategories
  @ManyToOne(() => User, (user) => user.otherCategories, {
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(tag: SkillType, user: User) {
    this.tag = tag;
    this.user = user;
  }

  static fromJson(json) {
    return new OtherCategory(json.tag, json.user);
  }
}

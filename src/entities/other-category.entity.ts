import { SkillType } from 'src/common/custom-type';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'other_categories' })
export class OtherCategory {
  @PrimaryColumn()
  id: string;

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
}

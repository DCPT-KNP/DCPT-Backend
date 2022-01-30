import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'other_categories' })
export class OtherCategory {
  @PrimaryColumn()
  id: string;

  @Column()
  tag: string;

  // many2one : user, othercategories
  @ManyToOne(() => User, (user) => user.otherCategories, {
    onDelete: 'CASCADE',
  })
  user: User;
}

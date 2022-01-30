import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Mission } from './mission.entity';
import { User } from './user.entity';

@Entity({ name: 'skill_cards' })
export class SkillCard {
  @PrimaryColumn({ type: 'uuid' })
  uuid: string;

  @Column()
  id: string;

  @Column()
  tag: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  // many2one : user, skillcard
  @ManyToOne(() => User, (user) => user.skillCards, {
    onDelete: 'CASCADE',
  })
  user: User;

  // one2many : mission, skillcard
  @OneToMany(() => Mission, (mission) => mission.skillCard)
  missions: Mission[];
}

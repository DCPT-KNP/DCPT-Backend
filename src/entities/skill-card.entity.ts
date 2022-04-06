import { CardStatusType } from '../common/custom-type';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Mission } from './mission.entity';
import { User } from './user.entity';
import { SkillTags } from './skill-tags.entity';

@Entity({ name: 'skill_cards' })
export class SkillCard {
  @PrimaryColumn({ type: 'uuid' })
  uuid: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'text',
  })
  tip: string;

  @Column({
    type: 'enum',
    enum: CardStatusType,
  })
  status: CardStatusType;

  // many2one : user, skillcard
  @ManyToOne(() => User, (user) => user.skillCards, {
    onDelete: 'CASCADE',
  })
  user: User;

  // one2many : mission, skillcard
  @OneToMany(() => Mission, (mission) => mission.skillCard)
  missions: Mission[];

  @OneToMany(() => SkillTags, (skillTags) => skillTags.skillCard)
  skillTags: SkillTags[];

  constructor(
    uuid: string,
    title: string,
    description: string,
    tip: string,
    user: User,
  ) {
    this.uuid = uuid;
    this.title = title;
    this.description = description;
    this.tip = tip;
    this.status = CardStatusType.NOT_STARTED;
    this.user = user;
  }
}

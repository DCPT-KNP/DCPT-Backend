import { SkillType } from '../common/custom-type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SkillCard } from './skill-card.entity';

@Entity({ name: 'skill_tags' })
export class SkillTags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SkillType,
  })
  tag: SkillType;

  @ManyToOne(() => SkillCard, (skillCard) => skillCard.skillTags, {
    onDelete: 'CASCADE',
  })
  skillCard: SkillCard;

  constructor(tag: SkillType, skillCard: SkillCard) {
    this.tag = tag;
    this.skillCard = skillCard;
  }
}

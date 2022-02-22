import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SkillCard } from './skill-card.entity';

@Entity({ name: 'missions' })
export class Mission {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  missionTitle: string;

  @Column()
  done: boolean;

  // many2one : skillcard, mission
  @ManyToOne(() => SkillCard, (skillCard) => skillCard.missions, {
    onDelete: 'CASCADE',
  })
  skillCard: SkillCard;

  constructor(missionTitle: string, skillCard: SkillCard) {
    this.missionTitle = missionTitle;
    this.done = false;
    this.skillCard = skillCard;
  }
}

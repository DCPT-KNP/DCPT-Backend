import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { SkillCard } from './skill-card.entity';

@Entity({ name: 'missions' })
export class Mission {
  @PrimaryColumn({ type: 'uuid' })
  uuid: string;

  @Column()
  id: string;

  @Column()
  missionTitle: string;

  @Column()
  done: boolean;

  // many2one : skillcard, mission
  @ManyToOne(() => SkillCard, (skillCard) => skillCard.missions, {
    onDelete: 'CASCADE',
  })
  skillCard: SkillCard;
}

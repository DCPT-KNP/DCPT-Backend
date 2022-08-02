import { IsEnum, IsOptional } from 'class-validator';
import { ShapeType, SkillType } from '../../common/custom-type';

export class CreateCareerModelDto {
  @IsEnum(ShapeType)
  type: ShapeType;

  @IsEnum(SkillType)
  primaryTag: SkillType;

  @IsOptional()
  @IsEnum(SkillType)
  secondaryTag?: SkillType;

  @IsOptional()
  @IsEnum(SkillType, { each: true })
  otherTag?: SkillType[] = [];

  isDuplicatedType(): boolean {
    const dup = new Map<SkillType, boolean>();

    // primary tag
    dup.set(this.primaryTag, true);

    // secondary tag와 중복된 스킬 타입이 있다면
    if (dup.has(this.secondaryTag)) {
      return true;
    }
    dup.set(this.secondaryTag, true);

    // other tag check
    for (let i = 0; i < this.otherTag.length; i++) {
      if (dup.has(this.otherTag[i])) {
        return true;
      }
      dup.set(this.otherTag[i], true);
    }

    return false;
  }
}

import { IsEnum, IsOptional } from 'class-validator';
import { ShapeType, SkillType } from 'src/common/custom-type';

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
}

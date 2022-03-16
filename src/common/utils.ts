import { CreateSNSInfoDto } from '../user/dto/create-sns-info.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { SkillType, SNSType } from './custom-type';
import { v4 as uuidv4 } from 'uuid';
import skillList from '../static/skill_category.json';
import { User } from '../entities/user.entity';
import { SkillCard } from '../entities/skill-card.entity';
import nicknameList from '../static/nickname.json';
import { AWS_S3_HOST } from './config';

const nicknameGenerator = () => {
  const { variables } = nicknameList;

  const rndIdx = Math.floor(Math.random() * variables.length);
  const newNickname = variables[rndIdx].concat(' ', '너딩이');

  return { rndIdx, newNickname };
};

export const checkUser = async (
  id: string,
  email: string,
  nickname: string,
  type: SNSType,
  _userService: UserService,
) => {
  const findUser = await _userService.findOneSNSInfo(id, type);

  if (findUser.success && findUser.response == null) {
    const { rndIdx, newNickname } = nicknameGenerator();

    const newUser: CreateUserDto = {
      email: email,
      nickname: newNickname,
      image: `${AWS_S3_HOST}/${rndIdx + 1}.jpg`,
      careerYear: null,
    };
    const newSNSInfo: CreateSNSInfoDto = {
      snsId: id,
      snsType: type,
      snsName: nickname,
    };
    const result = await _userService.create(newUser, newSNSInfo);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
        response: null,
        error: result.error,
      };
    }
  }

  return {
    success: true,
  };
};

export const createSkill = (
  queryRunner: any,
  tag: SkillType,
  user: User,
  isPrimaryOrSecondary: boolean,
) => {
  return new Promise(async (resolve, reject) => {
    const info = skillList[tag];
    const newDefaultSkill = new SkillCard(
      uuidv4(),
      tag,
      info.default.title,
      info.default.description,
      info.default.tip,
      user,
    );
    await queryRunner.manager.save(SkillCard, newDefaultSkill);

    if (isPrimaryOrSecondary) {
      info.other.forEach(async (item) => {
        const newOtherSkill = new SkillCard(
          uuidv4(),
          tag,
          item.title,
          item.description,
          item.tip,
          user,
        );
        await queryRunner.manager.save(SkillCard, newOtherSkill);
      });
    }

    resolve(true);
  });
};

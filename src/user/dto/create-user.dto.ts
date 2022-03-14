import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  image: string;

  @IsString()
  careerYear: string;
}

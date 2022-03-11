import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Err } from '../../common/error';
import { User } from '../../entities/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (authorization === undefined) {
      return false;
    }

    const token = authorization.replace('Bearer ', '');
    const result = await this.validate(token);

    const { sns_id, sns_type } = result;

    const findUser = await this._userService.findOneUser(sns_id, sns_type);
    const user: User = findUser.response;

    request.user = user;

    return result;
  }

  async validate(token: string) {
    try {
      return await this._authService.validateToken(token);
    } catch (e) {
      switch (e.message) {
        case 'invalid token':
          throw new UnauthorizedException(Err.TOKEN.INVALID_TOKEN);

        case 'invalid signature':
          throw new UnauthorizedException(Err.TOKEN.INVALID_TOKEN);

        case 'jwt expired':
          throw new UnauthorizedException(Err.TOKEN.JWT_EXPIRED);

        default:
          throw new HttpException('서버 오류입니다.', 500);
      }
    }
  }
}

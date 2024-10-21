import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  GqlExecutionContext,
} from '@nestjs/graphql';
import { LoginArgs } from './args/LoginArgs';
import { AccessToken } from './outputs/AccessToken';
import { AuthService } from '../auth.service';
import {
  BadRequestException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { RegisterArgs } from './args/RegisterArgs';
import { User } from 'src/modules/user/graphql/outputs/User';
import { JwtGuard } from '../guard/JwtGuard';
import { Request } from 'express';
import { SuccessOutput } from 'src/common/graphql/output/SuccessOutput';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Query(() => AccessToken)
  async login(
    @Args() args: LoginArgs,
    @Context() context: any,
  ): Promise<AccessToken> {
    const user = await this.authService.validateUser(args.login, args.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.generateTokens(user);

    context.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    return { accessToken: tokens.accessToken };
  }

  @Mutation(() => AccessToken)
  async register(
    @Args() args: RegisterArgs,
    @Context() ctx: any,
  ): Promise<AccessToken> {
    const user = await this.authService.createUser(args);
    if (!user) {
      throw new BadRequestException();
    }
    const tokens = await this.authService.generateTokens(user);
    ctx.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return { accessToken: tokens.accessToken };
  }

  @Query(() => AccessToken)
  async refresh(@Context() ctx: any): Promise<AccessToken> {
    const userId = await this.authService.getUserIdByRefreshToken(
      ctx.req.cookies?.refreshToken,
    );
    const user = await this.userService.findOneById(userId);
    const tokens = await this.authService.generateTokens(user);
    ctx.res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return { accessToken: tokens.accessToken };
  }

  @Query(() => SuccessOutput)
  async logout(@Context() ctx: any): Promise<SuccessOutput> {
    ctx.res.cookie('refreshToken', '', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expires: new Date(0),
    });
    return { success: true };
  }

  @UseGuards(JwtGuard)
  @Query(() => User)
  async me(@Context() ctx: any): Promise<User> {
    return ctx.req.user;
  }
}

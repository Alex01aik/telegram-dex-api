import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { FindManyArgs } from 'src/common/graphql/args/FindManyArgs';
import { ChatManyOutput } from './outputs/ChatManyOutput';
import { ChatService } from './chat.service';
import { Chat } from './outputs/Chat';
import { CreateOneChatArgs } from './graphql/args/CreateOneArgs';
import { UniqueArgs } from 'src/common/graphql/args/UniqueArgs';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from '../auth/guard/RoleGuard';
import { Roles } from '../auth/utils/RolesDecorator';
import { UserRole } from '@prisma/client';

@Resolver()
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Query(() => ChatManyOutput)
  async findManyChats(
    @Args({ nullable: true }) args?: FindManyArgs,
  ): Promise<ChatManyOutput> {
    return this.chatService.findMany(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => Chat)
  async createOneChat(@Args() args: CreateOneChatArgs): Promise<Chat> {
    return this.chatService.createOne(args);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @Mutation(() => Chat)
  async deleteOneChat(@Args() args: UniqueArgs): Promise<Chat> {
    return this.chatService.deleteOne(args.id);
  }
}

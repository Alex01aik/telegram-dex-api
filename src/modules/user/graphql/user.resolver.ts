import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UserService } from '../user.service';
import { UpdateOneUserArgs } from './args/UpdateOneUserArgs';
import { UniqueArgs } from 'src/common/graphql/args/UniqueArgs';
import { SuccessOutput } from 'src/common/graphql/output/SuccessOutput';
import { CreateOneUserArgs } from './args/CreateOneUserArgs';
import { User } from './outputs/User';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => User)
  async createOneUser(@Args() args: CreateOneUserArgs): Promise<User> {
    return this.userService.create(args);
  }

  @Mutation(() => SuccessOutput)
  async deleteOneUser(@Args() args: UniqueArgs): Promise<SuccessOutput> {
    await this.userService.delete(args.id);
    return { success: true };
  }

  @Mutation(() => SuccessOutput)
  async updateOneUser(@Args() args: UpdateOneUserArgs): Promise<SuccessOutput> {
    await this.userService.update(args);
    return { success: true };
  }

  @Query(() => [User])
  async findManyUsers() {
    return this.userService.findMany();
  }

  @Query(() => User, { nullable: true })
  async findOneUserById(@Args() args: UniqueArgs): Promise<User> {
    return this.userService.findById(args.id);
  }
}

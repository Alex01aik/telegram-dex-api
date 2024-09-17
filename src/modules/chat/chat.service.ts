import { Injectable } from '@nestjs/common';
import { InformatorService } from '../informator/informator.service';
import { TaskService } from '../task/task';

type HandleInformatorMessage = {
  informator: {
    username: string;
    telegramId: string;
  };
  message: string;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly informatorService: InformatorService,
    private readonly taskService: TaskService,
  ) {}

  async handleInformatorMessage(args: HandleInformatorMessage) {
    let informator = await this.informatorService.findByTelegramId(
      args.informator.telegramId,
    );
    if (!informator) {
      informator = await this.informatorService.create({
        telegramId: args.informator.telegramId,
        userName: args.informator.username,
      });
    }

    await this.taskService.processSnapshotChain(args.message, informator);
  }
}

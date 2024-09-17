import { BadRequestException } from '@nestjs/common';
import { TelegramClient } from 'telegram';

export function CheckConnect() {
  return (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const telegramClient: TelegramClient = this.telegramClient;
      if (telegramClient.disconnected) {
        await telegramClient.connect().catch((error) => {
          throw new BadRequestException(
            `Error with connection Telegram: ${error}`,
          );
        });
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

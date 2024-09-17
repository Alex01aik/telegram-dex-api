import { DynamicModule, Global, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';
import { ChatModule } from '../chat/chat.module';

@Global()
@Module({})
export class TelegramModule {
  static forRoot(
    apiId: number,
    apiHash: string,
    sessionString: string,
  ): DynamicModule {
    return {
      module: TelegramModule,
      imports: [ChatModule],
      providers: [
        {
          provide: TelegramClient,
          useFactory: async (): Promise<TelegramClient> => {
            try {
              const stringSession = new StringSession(sessionString);
              const telegramClient = new TelegramClient(
                stringSession,
                apiId,
                apiHash,
                {
                  connectionRetries: 5,
                  timeout: 150,
                },
              );
              if (!sessionString || !sessionString.length) {
                await telegramClient.start({
                  phoneNumber: async () => await input.text('number ?'),
                  password: async () => await input.text('password?'),
                  phoneCode: async () => await input.text('Code ?'),
                  onError: (err) => console.log(err),
                });
                console.log('You should now be connected.');
                console.log(telegramClient.session.save()); // Save this string to avoid logging in again
                await telegramClient.sendMessage('me', {
                  message: 'I connected!',
                });
              } else {
                const result = await telegramClient.connect();
                if (!result) {
                  throw new Error('Invalid connect');
                }
                console.log('API TELEGRAM USER connected with SUCCESS status!');
              }
              return telegramClient;
            } catch (err) {
              console.error(err);
              process.exit(1);
            }
          },
        },
        TelegramService,
      ],
      exports: [TelegramClient, TelegramService],
    };
  }
}

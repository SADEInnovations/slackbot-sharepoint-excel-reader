import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config(); 

export class SlackBot {
  private app: App;
  private awsLambdaReceiver: AwsLambdaReceiver;

  constructor() {
    this.awsLambdaReceiver = new AwsLambdaReceiver({
      signingSecret: process.env.SLACK_SIGNING_SECRET as string,
    });

    this.app = new App({
      token: process.env.SLACK_BOT_TOKEN as string,
      receiver: this.awsLambdaReceiver,
    });

    this.registerCommands();
  }

  private registerCommands(): void {
    this.app.command('/bonus', async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
      await ack();
      await respond(`Hello, <@${command.user_id}>! 👋`);

      console.log('Slack command executed:', {
        userId: command.user_id,
        command: '/bonus',
        details: command,
        timestamp: new Date().toISOString(),
      });
    });
  }

  public async processEvent(event: any, context: any, callback: any) {
    const handler = await this.awsLambdaReceiver.start();
    return handler(event, context, callback);
  }
}
  
export const slackBot = new SlackBot();

import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from "@slack/bolt";

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
    const slackBotCommand = process.env.SLACK_BOT_COMMAND as string;
    this.app.command(slackBotCommand, async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
      await ack();
      await respond(`Hello, <@${command.user_id}>! 👋`);

      console.log("Slack command executed:", {
        userId: command.user_id,
        command: slackBotCommand,
        details: command,
        timestamp: new Date().toISOString(),
      });
      console.log(`Your stage is ${process.env.STAGE}`)
    });
  }

  public async processEvent(event: any, context: any, callback: any) {
    const handler = await this.awsLambdaReceiver.start();
    return handler(event, context, callback);
  }
}

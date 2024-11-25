/* Copyright */
import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from "@slack/bolt";
import { fetchExcelDataWithCache } from "./excelApi";
import { getUserNameForStage } from "./stageHandler";
import { findUserRow } from "./userRowFinder";
import { messages } from "./messages";

export class SlackBot {
  private app: App;
  private awsLambdaReceiver: AwsLambdaReceiver;

  public constructor() {
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
    const currentStage = process.env.STAGE as string;

    this.app.command(slackBotCommand, async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
      await ack();

      try {
        const userName = getUserNameForStage(currentStage, command.text, command.user_name);

        const driveItemId = process.env.EXCEL_DRIVE_ITEM_ID as string;
        const worksheetId = process.env.EXCEL_WORKSHEET_ID as string;
        const range = process.env.RANGE as string;

        console.log(`Fetching data for ${userName}`);
        const excelData = await fetchExcelDataWithCache(driveItemId, worksheetId, range);
        const data = findUserRow(excelData, userName);

        await respond(
          messages.bonusMessage
            .replace("{remainingTotalBudget}", data.remainingTotalBudget.toString())
            .replace("{remainingTotalPayable}", data.remainingTotalPayable.toString())
        );
      } catch (error: unknown) {
        console.error("Error processing command:", error);

        if (error instanceof Error) {
          if (error.message === "No username provided in dev mode.") {
            await respond(messages.noUsernameDevMode);
          } else {
            await respond(messages.slackUserNotFound);
          }
        }
      }
    });
  }

  public async processEvent(event: any, context: any, callback: any): Promise<any> {
    const handler = await this.awsLambdaReceiver.start();
    return handler(event, context, callback);
  }
}

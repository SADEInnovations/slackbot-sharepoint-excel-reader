/* Copyright */
import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from "@slack/bolt";
import { fetchExcelDataWithCache } from "./excelApi";
import { getUserNameForStage } from "./stageHandler";
import { findUserRow } from "./userRowFinder";
import { messages } from "./messages";
import { AwsCallback, AwsEvent, AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { Handler } from "aws-lambda";

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

      let userName = "unknown";
      try {
        const cleanCommandText = command.text.trim();
        userName = getUserNameForStage(currentStage, cleanCommandText, command.user_name);

        const driveItemId = process.env.EXCEL_DRIVE_ITEM_ID as string;
        const worksheetId = process.env.EXCEL_WORKSHEET_ID as string;
        const range = process.env.RANGE as string; // Modify the range in both .env and GitHub secrets, if new data is added to a column that exceeds the current accessible range.

        console.log(`Fetching data for ${userName}`);
        const excelData = await fetchExcelDataWithCache(driveItemId, worksheetId, range);
        const data = findUserRow(excelData, userName);

        let message = messages.bonusMessage
          .replace("{remainingTotalBudget}", data.usableBonus.toFixed(2))
          .replace("{remainingTotalPayable}", data.payableBonus.toFixed(2));

        if (data.reservedTotal > 0) {
          const reservedMessage = messages.reservedMessage.replace("{reservedTotal}", data.reservedTotal.toFixed(2));
          message = `${message}\n${reservedMessage}`;
        }
        await respond(message);
      } catch (error: unknown) {
        console.error("Error processing command:", error);

        if (error instanceof Error) {
          if (error.message === "No username provided in dev mode.") {
            await respond(messages.noUsernameDevMode);
          } else {
            await respond(messages.slackUserNotFound.replace("{userName}", userName));
          }
        }
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public processEvent: Handler = async (event: AwsEvent, context: any, callback: AwsCallback): Promise<AwsResponse> => {
    const handler = await this.awsLambdaReceiver.start();
    return handler(event, context, callback);
  };
}

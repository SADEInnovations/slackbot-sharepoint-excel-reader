/* Copyright */
import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from "@slack/bolt";
import { fetchExcelDataWithCache } from "./excelApi";
import { getUserNameForStage } from "./stageHandler";
import { findUserRow } from "./userRowFinder";

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
    const currentStage = process.env.STAGE as string;

    this.app.command(slackBotCommand, async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
      await ack();

      let userName: string;
      try {
        userName = getUserNameForStage(currentStage, command.text, command.user_name);

        const driveItemId = process.env.EXCEL_DRIVE_ITEM_ID as string;
        const worksheetId = process.env.EXCEL_WORKSHEET_ID as string;
        const range = "A1:N41";

        console.log(`Fetching data for ${userName}`);
        const excelData = await fetchExcelDataWithCache(driveItemId, worksheetId, range);
        const data = findUserRow(excelData, userName);

        await respond(
          `Koko käytettävissä oleva bonuksesi on: ${data.remainingTotalBudget}€\nRahana maksettava summa: ${data.remainingTotalPayable}€`
        );
      } catch (error: unknown) {
        console.error("Error processing command:", error);

        if (error instanceof Error) {
          if (error.message === "No username provided in dev mode.") {
            await respond("No username provided in dev mode. Please provide the username in the command text.");
          } else {
            await respond("Your slack username was not found in the bonus excel, contact Mari");
          }
        }
      }
    });
  }

  public async processEvent(event: any, context: any, callback: any) {
    const handler = await this.awsLambdaReceiver.start();
    return handler(event, context, callback);
  }
}

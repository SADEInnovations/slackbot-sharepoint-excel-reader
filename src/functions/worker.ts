/* Copyright */
import { getUserNameForStage } from "./utils/stageHandler";
import { fetchExcelDataWithCache } from "./utils/excelApi";
import { findUserRow } from "./utils/userRowFinder";
import { messages } from "./utils/messages";
import { sendSlackResponse } from "./utils/sendSlackResponse";

interface WorkerEvent {
  commandText: string;
  username: string;
  responseUrl: string;
}

export async function handleWorkerEvent(event: WorkerEvent): Promise<void> {
  let userName: string = "";
  const currentStage = process.env.STAGE as string;
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    userName = getUserNameForStage(currentStage, event.commandText, event.username);

    console.log(`Fetching data for ${userName}`);
    const excelData = await fetchExcelDataWithCache(
      process.env.EXCEL_DRIVE_ITEM_ID as string,
      process.env.EXCEL_WORKSHEET_ID as string,
      process.env.RANGE as string
    );

    const bonusAmounts = findUserRow(excelData, userName);

    let message = messages.bonusMessage
      .replace("{remainingTotalBudget}", bonusAmounts.usableBonus.toFixed(2))
      .replace("{remainingTotalPayable}", bonusAmounts.payableBonus.toFixed(2));

    if (bonusAmounts.reservedTotal > 0) {
      const reservedMessage = messages.reservedMessage.replace(
        "{reservedTotal}",
        bonusAmounts.reservedTotal.toFixed(2)
      );
      message = `${message}\n${reservedMessage}`;
    }

    await sendSlackResponse(event.responseUrl, message);

    console.log("Bonus information sent successfully.");
  } catch (error) {
    console.error("Error in worker Lambda:", error);

    if (error instanceof Error) {
      if (error.message === "No username provided in dev mode.") {
        await sendSlackResponse(event.responseUrl, messages.noUsernameDevMode);
      } else if (error.message === "Already Claimed") {
        const claimedMessage = messages.alreadyInUseMessage.replace("{currentStage}", currentStage);

        await sendSlackResponse(event.responseUrl, claimedMessage);
      } else {
        const userNotFoundMessage = messages.slackUserNotFound.replace("{userName}", userName);
        await sendSlackResponse(event.responseUrl, userNotFoundMessage);
      }
    }
  }
}

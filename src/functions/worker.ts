/* Copyright */
import { getUserNameForStage } from "./utils/stageHandler";
import { fetchExcelDataWithCache } from "./utils/excelApi";
import { findUserRow } from "./utils/userRowFinder";
import { messages } from "./utils/messages";

interface WorkerEvent {
  commandText: string;
  username: string;
  responseUrl: string;
}

export async function handleWorkerEvent(event: WorkerEvent): Promise<void> {
  let userName: string = "";
  try {
    const currentStage = process.env.STAGE as string;

    console.log("Received event:", JSON.stringify(event, null, 2));

    userName = getUserNameForStage(currentStage, event.commandText, event.username);

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

    const response = await fetch(event.responseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send response to Slack: ${response.statusText}`);
    }

    console.log("Bonus information sent successfully.");
  } catch (error) {
    console.error("Error in worker Lambda:", error);

    if (error instanceof Error) {
      if (error.message === "No username provided in dev mode.") {
        const response = await fetch(event.responseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: messages.noUsernameDevMode,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send error response to Slack: ${response.statusText}`);
        }
      } else {
        const response = await fetch(event.responseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: messages.slackUserNotFound.replace("{userName}", userName),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send error response to Slack: ${response.statusText}`);
        }
      }
    }
  }
}

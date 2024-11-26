/* Copyright */
export function getUserNameForStage(
  currentStage: string,
  commandText: string | undefined,
  slackUserName: string
): string {
  let userName: string;

  if (currentStage === "production") {
    userName = slackUserName;
  } else {
    const text = commandText?.trim();
    if (!text) {
      throw new Error("No username provided in dev mode.");
    }
    userName = text;
  }

  return userName;
}

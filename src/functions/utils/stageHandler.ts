/* Copyright */
export function getUserNameForStage(
  currentStage: string,
  commandText: string | undefined,
  slackUserName: string
): string {
  let userName: string;

  if (currentStage === "production") {
    userName = slackUserName;
  } else if (currentStage === "dev1" || currentStage === "dev2") {
    const text = commandText?.trim();
    if (!text) {
      throw new Error("No username provided in dev mode.");
    }
    userName = text;
  } else {
    throw new Error("Unsupported stage.");
  }

  return userName;
}

/* Copyright */
const stageClaims: Record<string, string> = {};

export function getUserNameForStage(currentStage: string, commandText: string | undefined, user_name: string): string {
  let userName: string;

  if (currentStage === "production") {
    if (!user_name) {
      throw new Error("Slack username is undefined or empty.");
    }
    userName = user_name;
  } else {
    const text = commandText?.trim();
    if (!text) {
      throw new Error("No username provided in dev mode.");
    }
    userName = text;

    if (stageClaims[currentStage]) {
      if (stageClaims[currentStage] !== user_name) {
        throw new Error("Already Claimed");
      }
    } else {
      stageClaims[currentStage] = user_name;
    }
  }

  return userName;
}

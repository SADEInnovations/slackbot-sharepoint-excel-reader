/* Copyright */
export async function sendSlackResponse(responseUrl: string, messageText: string): Promise<void> {
  const response = await fetch(responseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: messageText,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send error response to Slack: ${response.statusText}`);
  }
}

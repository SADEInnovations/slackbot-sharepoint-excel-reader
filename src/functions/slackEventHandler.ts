/* Copyright */
import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";
import { AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { SlackBot } from "./utils/slackBot";

export async function handleSlackEvent(
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): Promise<AwsResponse> {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const slackBot = new SlackBot();

  try {
    return await slackBot.processEvent(event, context, callback);
  } catch (error) {
    console.error("Error processing the request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}

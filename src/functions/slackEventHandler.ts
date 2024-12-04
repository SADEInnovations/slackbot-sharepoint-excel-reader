/* Copyright */
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as dotenv from "dotenv";
import * as querystring from "querystring";

dotenv.config();

const lambdaClient = new LambdaClient({});

interface SlackEventBody {
  response_url: string;
  text: string;
  user_name: string;
  user_id: string;
}

export async function handleSlackEvent(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    if (!event.body) {
      throw new Error("Event body is null or undefined.");
    }

    let body: SlackEventBody;
    const contentType = event.headers["Content-Type"] || event.headers["content-type"];

    if (contentType === "application/json") {
      body = JSON.parse(event.body);
    } else if (contentType === "application/x-www-form-urlencoded") {
      body = querystring.parse(event.body) as unknown as SlackEventBody;
    } else {
      throw new Error(`Unsupported Content-Type: ${contentType}`);
    }

    console.log("Parsed body:", body);

    if (!body.user_name || body.user_name.trim() === "") {
      throw new Error("Slack user_name is missing in the request body.");
    }

    const responseUrl = body.response_url;

    if (!responseUrl) {
      throw new Error("Missing response_url in the request body.");
    }

    const workerPayload = {
      responseUrl,
      commandText: body.text || "",
      stage: process.env.STAGE,
      username: body.user_name,
      userID: body.user_id,
    };

    const invokeCommand = new InvokeCommand({
      FunctionName: process.env.WORKER_LAMBDA_NAME as string,
      InvocationType: "Event",
      Payload: JSON.stringify(workerPayload),
    });
    await lambdaClient.send(invokeCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ text: "Processing..." }),
    };
  } catch (error) {
    console.error("Error in Dispatcher Lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}

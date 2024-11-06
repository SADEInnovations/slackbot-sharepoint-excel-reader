import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  receiver: awsLambdaReceiver,
});

let lastCommandDetails: { userId: string; command: string } | null = null;
let lastResponseMessage: string | null = null;

app.command('/bonus', async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
  await ack();
  
  lastCommandDetails = {
    userId: command.user_id,
    command: "/bonus"
  };
  
  const responseMessage = `Hello, <@${command.user_id}>! 👋`;
  await respond(responseMessage);
  lastResponseMessage = responseMessage;  
  
  console.log('Slack command executed:', {
    userId: command.user_id,
    command: '/bonus',
    details: command,
    timestamp: new Date().toISOString()
  });
});

export const getLastCommandDetails = () => lastCommandDetails;
export const getLastResponseMessage = () => lastResponseMessage;

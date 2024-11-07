import { App, SlackCommandMiddlewareArgs, AwsLambdaReceiver } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

export const slackapp = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  receiver: awsLambdaReceiver,
});

slackapp.command('/bonus', async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
  await ack();
  
  const responseMessage = `Hello, <@${command.user_id}>! 👋`;
  await respond(responseMessage); 
  
  console.log('Slack command executed:', {
    userId: command.user_id,
    command: '/bonus',
    details: command,
    timestamp: new Date().toISOString()
  });
});

import { App, SlackCommandMiddlewareArgs } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  appToken: process.env.SLACK_APP_TOKEN as string,
  socketMode: true,
});

app.command('/bonus', async ({ command, ack, respond }: SlackCommandMiddlewareArgs) => {
  await ack(); 
  await respond(`Hello, <@${command.user_id}>! 👋`);
});

app.start().then(() => {
  console.log('⚡️ Bolt app is running in Socket Mode!');
});
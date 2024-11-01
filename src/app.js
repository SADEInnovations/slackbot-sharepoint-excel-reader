import pkg from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config(); 

const { App } = pkg;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN, 
  socketMode: true, 
});

app.command('/bonus', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command
  await respond(`Hello, <@${command.user_id}>! 👋`);
});

(async () => {
  await app.start(); 
  console.log('⚡️ Bolt app is running in Socket Mode!');
})();

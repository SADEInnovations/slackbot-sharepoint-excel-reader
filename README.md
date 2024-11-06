# slackbot-sharepoint-excel-reader
A slackbot which reads an excel file from sharepoint and returns a specific column from it from a specific row according to the calling users slack handle

> Uses `NodeJS` 20 and `npm` 10


## Table of Contents

- [Creating a simple slackbot that can be used locally](#Creating-a-simple-slackbot-that-can-be-used-locally)
    - [Setup bot](#setup-bot)
    - [Bot settings and config](#bot-settings-and-config)
        - [Settings](#settings)
        - [Features](#features)
    - [Code](#code)
    - [Starting the bot locally](#start)
- [Hosting on AWS Lambda by deploying it with serverless](#hosting-on-aws-lambda-and-deploying-the-bot-with-serverless)
    - [Setting up AWS and serverless](#installing-and-setting-up-aws-and-serverless)
    - [Hosting on AWS serverless](#hosting)

## Creating a simple slackbot that can be used locally
### Setup bot 
1. [Go to Slack API your apps](https://api.slack.com/apps)
2. Press Create New App and select from scratch
3. add a name 
4. Workspace: Wherever you want the bot to be

### Bot settings and config
#### Settings
1. In basic information, scroll down to App-Level Tokens and Generate Token and Scopes 
    - add a name 
    - add scope -> connections:write
    - Generate 
    - Save the generated token somewhere for now
2. go to socket mode and enable it

#### Features
1. go to OAuth & Permissions
2. Save Bot User OAuth token somewhere for now
> 3. Might not be needed. Set redirect URLs as https://localhost
4. Add Bot Token Scopes 
    - chat:write
    - commands
5. go to Slash commands and press Create New Command
    - Command name: whatever you want it to be
    - Fill in the required fields and press Save.


### Code 
1. Make a folder or move into a prefered one
```yaml
mkdir <your-folder-name>
cd <your-folder-name>
```
2. Install needed dependencies and start the project
```yaml
npm install -g typescript
npm init -y
npm install typescript --save-dev
npm install @slack/bolt
npm install dotenv --save
npx tsc --init
```
in your package.json file, dependencies should be @slack/bolt and devDependencies should be typescript and dotenv

2. Make a new folder called src and a file inside it called app.ts
3. go into your package.json, delete the exsisting "test" script and make a new one for example:
```yaml
"scripts": {
    "start": "tsc && node build/app.js"
}
```
4. create a .env file
```yaml
SLACK_BOT_TOKEN = <Your Bot User OAuth token>
SLACK_APP_TOKEN = <Your App-Level Token>
```

### Start
1. Make sure you have downloaded all the needed dependencies 
2. Make sure you're in the project root
```yaml
cd /<your-folder-name>/slackbot-sharepoint-excel-reader
```
3. type npm start, it should create a folder "build" and a file inside of it called "app.js" and give you this output in your terminal
```yaml
npm start

> slackbot0.0.1 start
> tsc && node build/app.js

⚡️ Bolt app is running in Socket Mode!
```

Go into slack and try typing /"your-command" in any channel. The bot should respond "Hello + your name 👋"
You can stop the bot by pressing CTRL + C in your terminal. After that, the bot should stop responding to your command

this is what your project structure should look like:
```yaml
Slackbot-Sharepoint-Excel-Reader
│
├── build               
│   └── app.js
│
├── node_modules        
│
├── src                  
│   └── app.ts
│
├── .env                 
├── .gitignore          
├── package-lock.json    
├── package.json         
├── README.md          
└── tsconfig.json
```
## Hosting on AWS Lambda and deploying the bot with serverless
### Installing and setting up AWS and serverless
1. [Sing in into AWS console](https://aws.amazon.com/console/)
2. Click on your name on the top right corner and click security credentials
3. Create an access key and take write them down / download them
4. install AWS CLI [see documentation here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
5. Configure your AWS CLI tool to use your access keys
```yaml
aws configure

AWS Access Key ID [None]: <copy & paste your access key> 
AWS Secret Access Key [None]: <copy & paste your secret key> 
Default region name [None]: <choose whatever you want>
Default output format [None]: JSON 
```
6. install serverless and serverless offline for local testing
```yaml
npm i serverless -g
npm install serverless-offline --save-dev
```
### Hosting
> At this point you should have files like serverless.yml and handler.js in src
```yaml
Slackbot-Sharepoint-Excel-Reader
│
├── .serverless/              
│
├── build/                     
│   ├── app.js              
│   └── handler.js          
│
├── node_modules/             
│
├── src/                       
│   ├── app.ts               
│   └── handler.ts              
│
├── .env                     
├── .gitignore                 
├── package-lock.json        
├── package.json              
├── README.md                
├── serverless.yml           
└── tsconfig.json        
```
1. Go to Slack api -> socket mode and disable it
2. type serverless deploy 
3. When its ready, it will give you an endpoint looking something like "https://6psdswxvx2.execute-api.eu-north-1.amazonaws.com/dev/slack/events"
> Remember that this will change everytime you do serverless deploy so you have to do the next part again each time.
4. Copy the endpoint and go to [Slack api](https://api.slack.com/apps/)
    - Select your app
    - Paste the given endpoint to: 
    - Slash commands -> Edit command -> request URL
    - OAuth & Permissions -> Redirect URLs
5. in .env file add SLACK_SIGNIN_SECRET. This can be found [Slack api](https://api.slack.com/apps/) Basic information.
```yaml
SLACK_BOT_TOKEN = <your-slack-oauth-token>
SLACK_APP_TOKEN = this can be deleted or commented out 
SLACK_SIGNING_SECRET = <your-slack-signin-secret>
```
6. Go to slack and try typing /your-command. 
7. The bot should reply with "Hello + your name 👋"



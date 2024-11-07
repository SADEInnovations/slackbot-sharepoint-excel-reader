# slackbot-sharepoint-excel-reader
A slackbot which reads an excel file from sharepoint and returns a specific column from it from a specific row according to the calling users slack handle

> Uses `NodeJS` 20 and `npm` 10


## Table of Contents

- [Creating a simple slackbot](#creating-a-slackbot)
    - [Setup bot](#setup-bot)
    - [Code](#code)
- [Local Testing](#local-testing)
- [Hosting on AWS lambda](#hosting-on-aws-lambda)


## Creating a slackbot
### Setup bot 
1. [Go to Slack API your apps](https://api.slack.com/apps)
2. Press Create New App and select from scratch
3. add a name 
4. Workspace: Wherever you want the bot to be
5. In basic information there is a signin secret. Press show, then copy and paste it somewhere
6. In OAuth & Permissions there is a Bot user OAuth token. Copy it and paste it somewhere

### Code 
1. Clone the repository
2. Install needed dependencies
3. create a .env file
```yaml
SLACK_BOT_TOKEN = <Your Bot User OAuth token>
SLACK_SIGNIN_SECRET = <Your Slack Signin Secret>
```

## Local Testing
1. Install serverless and serverless offline for local testing
```yaml
npm i serverless -g
npm install serverless-offline --save-dev
```
2. uncomment the plugins part in serverless.yml
3. Install ngrok (for mac) by following these steps[here](https://download.ngrok.com/mac-os)
4. Type serverless offline and ngrok http 3000 in your cli.
> Using 2 CLIs may be necessary, since typing serverless offline and ngrok http 3000 in the same cli doesnt seem to work
5. ngrok will give you a forwarding URL. copy it 
6. go to your app in slack api and go into Slash Commands
7. after pasting it add "/dev/slack/events" to the urls end
8. type /bonus to see if it works.

## Hosting on AWS Lambda
### Installing and setting up AWS
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

1. type serverless deploy 
2. When its ready, it will give you an endpoint looking something like "https://6psdswxvx2.execute-api.eu-north-1.amazonaws.com/dev/slack/events"
> If you do serverless remove at some point, do the next parts again.
3. Copy the endpoint and go to [Slack api](https://api.slack.com/apps/)
    - Select your app
    - Paste the given endpoint to: 
    - Slash commands -> Edit command -> request URL
    - OAuth & Permissions -> Redirect URLs
4. Type your command and go into your aws console -> CloudWatch -> Log groups -> Select your log stream
    - There should be a log which shows the recieved event and that a slack command was executed




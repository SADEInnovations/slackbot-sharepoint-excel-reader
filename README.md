# slackbot-sharepoint-excel-reader
A slackbot which reads an excel file from sharepoint and returns a specific column from it from a specific row according to the calling users slack handle

> Uses `NodeJS` 20 and `npm` 10

## Creation of the bot 
### Setup bot 
1. [Go to Slack API your apps](https://api.slack.com/apps)
2. Press Create New App and select from scratch
3. add a name 
4. Workspace SADE Innovations

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

### Code 
1. Clone 
2. npm i in the project directory 
3. create a .env file 

***.env file***
```yaml
SLACK_BOT_TOKEN = <Your Bot User OAuth token>
SLACK_APP_TOKEN = <Your App-Level Token>
```

### Start
1. Go to your project folder and type npm start
2. CTRL + C to stop the bot 

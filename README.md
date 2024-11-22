# slackbot-sharepoint-excel-reader

A slackbot which reads an excel file from sharepoint and returns a specific column from it from a specific row according to the calling users slack handle

> Uses `NodeJS` 20 and `npm` 10

## Table of Contents

- [Creating a simple slackbot](#creating-a-slackbot)
  - [Setup bot](#setup-bot)
  - [Code](#code)
- [Local Testing](#local-testing)
- [Hosting on AWS lambda](#hosting-on-aws-lambda)
  - [Installing and setting up AWS](#installing-and-setting-up-aws)
- [Using Mircosoft Graph API to fetch an excel file from sharepoint](#using-mircosoft-graph-api-to-get-an-excel-file-from-sharepoint)
  - [Register an app with Microsoft Entra](#register-an-app-with-microsoft-entra)
    - [App configuration](#app-configuration)
  - [Get the excel File from personal OneDrive / Sharepoint](#fetch-the-excel-file)

## Creating a slackbot

### Setup bot

1. [Go to Slack API your apps](https://api.slack.com/apps)
2. Press Create New App and select from scratch
3. add a name
4. Workspace: Wherever you want the bot to be
5. In basic information there is a signin secret. Press show, then copy and paste it somewhere
6. In OAuth & Permissions there is a Bot user OAuth token. Copy it and paste it somewhere
7. Create 3 Slash Commands. /dev1, /dev2 and /bonus

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

2. Choose what stage you want to deploy to. "Production" (final production), "dev1" (developement stage 1) or "dev2" (developement stage 2)
3. Type the following in your terminal. Replace your-chosen-stage with the stage you want.

```yaml
export STAGE=<your-chosen-stage>
```

4. Install ngrok (for mac) by following these steps[here](https://download.ngrok.com/mac-os)
5. Type serverless offline and ngrok http 3000 in your cli.
   > Using 2 CLIs may be necessary, since typing serverless offline and ngrok http 3000 in the same cli doesn't seem to work
6. ngrok will give you a forwarding URL. copy it
7. go to your app in slack api and go into Slash Commands and select the same command as your chosen stage
8. after pasting it add "/YOUR-STAGE/slack/events" to the urls end. Replace YOUR-STAGE with the stage you chose
9. the command depends on your stage, for dev1 its /dev1, dev2 /dev2, and for production its /bonus.
10. Type the command depending on your stage E.g in direct messages.

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

1. Type export STAGE={your-chosen-stage}. It's common practise to use dev1 and dev2 as your own developement stages and prodution as the stage where the final product goes.
2. type serverless deploy
3. When its ready, it will give you an endpoint looking something like "https://6psdswxvx2.execute-api.eu-north-1.amazonaws.com/YOUR-STAGE/slack/events"
4. Copy the endpoint and go to [Slack api](https://api.slack.com/apps/)
   - Select your app
   - Paste the given endpoint to:
   - Slash commands -> Choose the command depending on your stage -> Edit command -> request URL
   - OAuth & Permissions -> Redirect URLs
5. Type your command in slack and go into your aws console -> CloudWatch -> Log groups -> Select your log stream
   - There should be a log which shows the recieved event and that a slack command was executed

## Using Mircosoft Graph API to fetch an excel file from sharepoint

### Register an app with Microsoft Entra

1. Go to [Microsoft Azure](https://portal.azure.com/) and login.
2. Very top after the welcoming message there should be 3 options
   - Start with an azure free trial
   - manage Microsoft Entra ID
   - Access student benefits
3. Click view on manage Microsoft Entra ID. There you should see "My feed" The first option should be Try Microsoft Entra admin center. Press on Go to Microsoft Entra
4. When logged in, you should be in Microsoft Entra admin center. In the left nav bar click on Applications -> App registrations -> New registraion
5. Choose a name
6. For supported account types, choose what fits with the type of application your doing. [about them here](https://learn.microsoft.com/en-us/security/zero-trust/develop/identity-supported-account-types)
7. For redirect url put http://localhost and then click register

#### App Configuration

1. After creating the app, go to your .env file and create 3 new variables.
   - TENANT_ID
   - CLIENT_ID
   - CLIENT_SECRET
2. Tenant ID and Client ID can be found in your apps overview
3. To get Client secret, go to Certificates & Secrets -> Client secrets -> New client secret.
4. After creating it copy the Value and put it into .env CLIENT_SECRET

### Fetch the excel file

1. In Microsoft Entra -> applications -> app registrations choose your app
2. Go to API permissions
3. Click add a permission -> Microsoft Graph -> Application permissions and look for Files.Read.All and Sites.Read.All
4. Click grant admin consent.
   > Tools like Postman or Microsoft Graph Explorer are great for testing purposes. I'll be using postman here
5. Open postman and create a requests for

   - Getting an access token
     > POST request to the url "https://login.microsoftonline.com/{your-tenant-id}/oauth2/v2.0/token"
     > Add a header -> Content-Type:application/x-www-form-urlencoded
     > in body -> client_id:{your-client-id}, scope:https://graph.microsoft.com/.default, client_secret:{your-client-secret}, grant_type:client_credentials
     > Press send. It should give you an output looking something like this

   ```yaml
   { "token_type": "Bearer", "expires_in": "3599", "ext_expires_in": 3599, "access_token": "your access token" }
   ```

   #### for all the next parts

   > GET request
   > add a header -> Authorization:Bearer {your-access-token}

   - looking for an excel file

     > the url is https://graph.microsoft.com/v1.0/drive/search(q='.xlsx')
     > It should give you an output with all the excel files found. Find the one you're looking for and write down the id below createdDateTime
     > Add the id to .env as EXCEL_DRIVE_ITEM_ID={your-excel-file-id}

   - getting worksheet id

     > the url is https://graph.microsoft.com/v1.0/drive/items/{your-excel-file-id}/workbook/worksheets/
     > find the one you're looking for. In the next part you can access it to see if its the right one
     > Add the id to .env as EXCEL_WORKSHEET_ID={your-worksheet-id}. Keep the curly brackets on this

   - accessing the excel file
     > the url is https://graph.microsoft.com/v1.0/drive/items('your-excel-file-id')/workbook/worksheets('{your-worksheet-id}')/range(address='A1:N42')
     > the range can be modified depending on your excel file size.

If all of the postman requests were successful, you can move on. If you counter problems like accessDenied, it might be because of insufficient permissions.

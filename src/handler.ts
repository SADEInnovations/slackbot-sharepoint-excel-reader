import { APIGatewayProxyEvent, Context, APIGatewayProxyResult, Callback } from 'aws-lambda';
import dotenv from 'dotenv';
import { awsLambdaReceiver, getLastCommandDetails, getLastResponseMessage } from './app';
import { AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

dotenv.config();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    const awsEvent: AwsEvent = {
      ...event,
      multiValueQueryStringParameters: event.multiValueQueryStringParameters || {},
      multiValueHeaders: event.multiValueHeaders || {},
    };
    
    const handler = await awsLambdaReceiver.start();
    const result = await handler(awsEvent, context, callback);
    
    const commandDetails = getLastCommandDetails();
    const responseMessage = getLastResponseMessage();
    
    if (commandDetails && responseMessage) {
      console.log("Answer given:", responseMessage);
    }

    return result;
  } catch (error) {
    console.error('Error processing the request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

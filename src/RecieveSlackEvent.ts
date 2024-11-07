import { APIGatewayProxyEvent, Context, APIGatewayProxyResult, Callback } from 'aws-lambda';
import dotenv from 'dotenv';
import { awsLambdaReceiver } from './SlackCommand';
import { AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

dotenv.config();

export const HandleSlackEvent = async (
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
    
    return result;
  } catch (error) {
    console.error('Error processing the request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

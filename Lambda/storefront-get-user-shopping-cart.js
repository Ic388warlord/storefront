const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    try {

      console.log("event:", event);

      const dynamoDB = new AWS.DynamoDB.DocumentClient();
      const TABLE_NAME = 'storefront_shopping_cart';

      const userEmail = event.user_email;

      const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'user_email = :email', // Filter items where user_email matches
        ExpressionAttributeValues: {
          ':email': userEmail,
        },
      };

      const result = await dynamoDB.scan(params).promise();

      console.log('result:', JSON.stringify(result, null, 2));

      const extractedData = result.Items.map(item => ({
        count: item.count,
        product_id: item.product_id,
      }));

      console.log('extractedData:', JSON.stringify(extractedData, null, 2));

      return {
        statusCode: 200,
        body: extractedData,
      };
    } catch (error) {
      console.error('Error fetching items from DynamoDB table:', error);

      return {
        statusCode: 500,
        body: { error: 'Failed to fetch items from DynamoDB table' },
      };
    }
  });
};

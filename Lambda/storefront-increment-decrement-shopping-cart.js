const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'storefront_shopping_cart';

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    try {
      const { user_email, product_id, operation } = event;

      console.log(user_email);
      console.log(product_id);
      console.log(operation);

      // Check if the operation is 'increment'
      if (operation !== 'increment' && operation !== 'decrement') {
        throw new Error(`Unsupported operation: ${operation}`);
      }

      // Scan the table for the matching entry
      const scanParams = {
        TableName: TABLE_NAME,
        FilterExpression: 'product_id = :product_id AND user_email = :user_email',
        ExpressionAttributeValues: {
          ':product_id': product_id,
          ':user_email': user_email,
        }
      };

      const scanResult = await dynamoDB.scan(scanParams).promise();

      if (scanResult.Items.length === 0) {
        throw new Error(`No cart found for user ${user_email} with product_id ${product_id}`);
      }

      const cartItem = scanResult.Items[0];
      const cart_id = cartItem.cart_id;
      console.log(`Cart ID: ${cart_id}`);

      const updateExpression = operation === 'increment'
        ? 'SET #count = #count + :value'
        : 'SET #count = #count - :value';

      if (operation === 'decrement' && cartItem.count <= 0) {
        throw new Error('Cannot decrement count below zero');
      }

      // Update the count field
      const updateParams = {
        TableName: TABLE_NAME,
        Key: {
          cart_id: cart_id,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: {
          '#count': 'count',
        },
        ExpressionAttributeValues: {
          ':value': 1,
        },
        ReturnValues: 'UPDATED_NEW',
      };

      const updateResult = await dynamoDB.update(updateParams).promise();
      console.log(`Count ${operation}ed successfully: ${JSON.stringify(updateResult)}`);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Count ${operation}ed successfully` }),
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  });
};


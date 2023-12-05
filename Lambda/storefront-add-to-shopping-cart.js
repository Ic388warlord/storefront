const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'storefront_shopping_cart';

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-add-to-shopping-cart-lambda', async () => {
    try {
      const user_email = event.user_email;
      const product_id = event.product_id;

      const scanParams = {
        TableName: TABLE_NAME,
        FilterExpression: 'product_id = :prodId AND user_email = :userEmail',
        ExpressionAttributeValues: {
          ':prodId': product_id,
          ':userEmail': user_email
        },
      };

      const scanResult = await dynamoDB.scan(scanParams).promise();

      console.log("queryResult: ", scanResult);

      if (scanResult.Items.length === 1) {

        const card_id_to_increment_count = scanResult.Items[0].cart_id

        const getItemParams = {
          TableName: TABLE_NAME,
          Key: {
            cart_id: card_id_to_increment_count,
          },
        };

        const getItemResult = await dynamoDB.get(getItemParams).promise();

        console.log("getItemResult: ", getItemResult);

        const updateParams = {
          TableName: TABLE_NAME,
          Key: {
            cart_id: card_id_to_increment_count,
          },
          UpdateExpression: 'SET #count = #count + :incr',
          ExpressionAttributeNames: {
            '#count': 'count',
          },
          ExpressionAttributeValues: {
            ':incr': 1,
          },
          ReturnValues: 'UPDATED_NEW',
        };

        await dynamoDB.update(updateParams).promise();

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Count updated successfully' }),
        };

      } else if (scanResult.Items.length === 0) {

        console.log("No existing match. Insert in a new data entry.")

        const cart_id = AWS.util.uuid.v4();
        const count = 1; // Set default count to 1

        const params = {
          TableName: TABLE_NAME,
          Item: {
            cart_id,
            count,
            product_id,
            user_email,
          },
        };

        await dynamoDB.put(params).promise();

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Item inserted successfully' }),
        };

      } else {

        console.log("matching # of items is not 1.");

        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Duplicated items found in shopping cart under this user. Please check the database table as the target for count increment cannot be decided.' }),
        };
      }
    } catch (error) {
      console.error('Error scanning DynamoDB table:', error);

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unhandled error' }),
      };
    }
  });
}
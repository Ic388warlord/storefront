const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'storefront_shopping_cart';

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-delete-from-shopping-cart-lambda', async () => {

    try {
      const user_email = event.user_email;
      const product_id = event.product_id;

      console.log(user_email);
      console.log(product_id);

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

        const cart_id_to_remove = scanResult.Items[0].cart_id

        const deleteParams = {
          TableName: TABLE_NAME,
          Key: {
            cart_id: cart_id_to_remove,
          },
        };

        await dynamoDB.delete(deleteParams).promise();

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Item removed successfully' }),
        };

      } else if (scanResult.Items.length === 0) {

        console.log("No existing match. Nothing to remove.");

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'No item found to remove' }),
        };

      } else {

        console.log("Matching number of items is not 1 or 0.");

        return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Multiple items found. Unable to remove. Please check the database.' }),
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
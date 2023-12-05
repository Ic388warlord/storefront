// To get the product, provide the product_id in the request body. Use GET. 
const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    console.log("EVENT: ", event);

    const TABLE_PRODUCT = process.env.TABLE_PRODUCT;
    const TABLE_INVENTORY = process.env.TABLE_INVENTORY;

    try {
      // Extract product ID from the request body
      const productId = event.product_id;
      // const inventoryId = event.product_id;

      console.log("PRODUCT ID: ", productId)

      const paramsProduct = {
        TableName: TABLE_PRODUCT,
        Key: {
          product_id: productId,
        },
      };

      const paramsInventory = {
        TableName: TABLE_INVENTORY,
        Key: {
          product_id: productId,
        },
      };

      const productResult = await dynamoDB.get(paramsProduct).promise();
      const inventoryResult = await dynamoDB.get(paramsInventory).promise();

      console.log('Get succeeded for Product table:', JSON.stringify(productResult, null, 2));
      console.log('Get succeeded for Inventory table:', JSON.stringify(inventoryResult, null, 2));

      if (productResult.Item && inventoryResult) {

        const resultJson = {
          "product_id": productResult["Item"]["product_id"],
          "product_name": productResult["Item"]["product_name"],
          "product_category": productResult["Item"]["product_category"],
          "product_description": productResult["Item"]["product_description"],
          "product_images": productResult["Item"]["product_images"],
          "product_price": productResult["Item"]["product_price"],
          "product_inventory": inventoryResult["Item"]["amount"]
        }

        return {
          statusCode: 200,
          body: resultJson,
        };
      } else {
        return {
          statusCode: 404,
          body: { error: 'Product not found' },
        };
      }
    } catch (error) {
      console.error('Error reading from DynamoDB table:', error);

      return {
        statusCode: 500,
        body: { error: 'Failed to read from DynamoDB table' },
      };
    }
  });
};



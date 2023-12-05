const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'storefront_favorite_products';

async function getFavoriteProducts(userEmail) {
  const params = {
    TableName: tableName,
    Key: {
      email: userEmail,
    },
  };

  try {
    const response = await client.get(params).promise();
    const products = response.Item.products || [];

    return {
      statusCode: 200,
      body: products,
    };

  } catch (err) {
    console.log("Error reading DB: ", err);
    return {
      statusCode: 500,
      body: "Error: " + JSON.stringify(err),
    };
  }
}


exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-get-favorite-products-lambda', async () => {
    try {
      console.log("EVENT: ", event)

      const email = event.email;
      const result = await getFavoriteProducts(email);
      return result;

    } catch (err) {

      return {
        statusCode: 400,
        body: JSON.stringify(err),
      };
    }
  });
};

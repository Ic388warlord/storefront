const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    console.log("EVENT:", JSON.stringify(event));

    const TABLE_PRODUCT = process.env.TABLE_PRODUCT;

    const search = event.pathParams.name;

    const searchProductsParams = {
      TableName: TABLE_PRODUCT
    }

    try {
      const result = await dynamoDB.scan(searchProductsParams).promise();

      console.log("RESULT:", JSON.stringify(result));

      const items = result.Items;
      const foundItems = items.filter(item => item.product_name.toLowerCase().includes(search.toLowerCase()));
      console.log(foundItems);

      return { statusCode: 200, body: foundItems };
    } catch (err) {
      console.log("ERR:", err.message);
      return { statusCode: 500, body: { error: "Failed to read from dynamoDB" } };
    }
  });
};

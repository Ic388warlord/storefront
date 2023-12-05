const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));


exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-add-product-lambda', async () => {
    try {
      const dynamoDB = new AWS.DynamoDB.DocumentClient();

      let product_category = event.product_category;
      let product_description = event.product_description;
      let product_images = event.product_images;
      let product_name = event.product_name;
      let product_price = event.product_price;
      let amount = event.inventory_amount;

      console.log("Grabbing info: ", product_category, product_description, product_images)

      const product_id = AWS.util.uuid.v4();
      console.log("UUID: ", product_id)


      const TABLE_PRODUCT = process.env.TABLE_PRODUCT;
      const TABLE_INVENTORY = process.env.TABLE_INVENTORY;

      const productParams = {
        TableName: TABLE_PRODUCT,
        Item: {
          product_id,
          product_category,
          product_description,
          product_images,
          product_name,
          product_price
        },
      };

      const inventoryParams = {
        TableName: TABLE_INVENTORY,
        Item: {
          product_id,
          amount
        }
      }

      await dynamoDB.put(productParams).promise();
      await dynamoDB.put(inventoryParams).promise();

      return {
        statusCode: 200,
        body: { message: `Product ${product_name} inserted` },
      };
    } catch (error) {
      console.error('Error inserting into DynamoDB table:', error);

      return {
        statusCode: 500,
        body: { error: 'Failed to insert into DynamoDB table' },
      };
    }
  });
};

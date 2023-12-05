const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// Initialize AWS DynamoDB DocumentClient
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-add-to-inventory-lambda', async () => {
    // DynamoDB table names
    const productTableName = "storefront_product";
    const inventoryTableName = "storefront_inventory";

    const product_id = AWS.util.uuid.v4();
    console.log("UUID: ", product_id)

    // Required fields
    const requiredFields = [
      'product_category',
      'product_description',
      'product_images',
      'product_name',
      'product_price',
      'amount',
    ];

    // Check for null or empty fields
    for (const field of requiredFields) {
      if (!event[field] && event[field] !== 0) { // Checks for null, undefined, and empty string, but allows 0
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Bad Request: ${field} cannot be null or empty` }),
        };
      }
    }

    // Parse event data
    const {
      product_category,
      product_description,
      product_images,
      product_name,
      product_price,
      amount,
    } = event;

    // Check if the product_id already exists in either table
    const productExists = await checkIfProductExists(productTableName, product_id);
    const inventoryExists = await checkIfProductExists(inventoryTableName, product_id);

    if (productExists || inventoryExists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad Request: Product already exists' }),
      };
    }

    // Prepare the item for the product table
    const productItem = {
      TableName: productTableName,
      Item: {
        product_id,
        product_category,
        product_description,
        product_images,
        product_name,
        product_price,
      },
    };

    // Prepare the item for the inventory table
    const inventoryItem = {
      TableName: inventoryTableName,
      Item: {
        product_id,
        amount,
      },
    };

    try {
      // Insert into storefront_product table
      await documentClient.put(productItem).promise();

      // Insert into storefront_inventory table
      await documentClient.put(inventoryItem).promise();

      // Return a success response
      return {
        statusCode: 200,
        body: JSON.stringify('Product and inventory data inserted successfully'),
      };
    } catch (error) {
      // Log the error and return a failure response
      console.error('Error inserting data into DynamoDB', error);
      return {
        statusCode: 500,
        body: JSON.stringify('Error inserting data into DynamoDB'),
      };
    }
  });
};

async function checkIfProductExists(tableName, productId) {
  const params = {
    TableName: tableName,
    Key: {
      product_id: productId,
    },
  };

  try {
    const response = await documentClient.get(params).promise();
    return response.Item != null;
  } catch (error) {
    console.error(`Error checking for existence of product in ${tableName}`, error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// Initialize AWS DynamoDB DocumentClient
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-edit-inventory-lambda', async () => {

    // DynamoDB table names
    const productTableName = "storefront_product";
    const inventoryTableName = "storefront_inventory";

    // Required fields
    const requiredFields = [
      'product_id',
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
      product_id,
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

    if (!(productExists && inventoryExists)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad Request: Product does not exist in product table or inventory table.' }),
      };
    }

    // Prepare the update parameters for the product table
    const productUpdateParams = {
      TableName: productTableName,
      Key: { product_id },
      UpdateExpression: 'set product_category = :pc, product_description = :pd, product_images = :pi, product_name = :pn, product_price = :pp',
      ExpressionAttributeValues: {
        ':pc': product_category,
        ':pd': product_description,
        ':pi': product_images,
        ':pn': product_name,
        ':pp': product_price,
      },
    };

    // Prepare the update parameters for the inventory table
    const inventoryUpdateParams = {
      TableName: inventoryTableName,
      Key: { product_id },
      UpdateExpression: 'set amount = :a',
      ExpressionAttributeValues: {
        ':a': amount,
      },
    };

    try {
      // Insert into storefront_product table
      await documentClient.update(productUpdateParams).promise();

      // Insert into storefront_inventory table
      await documentClient.update(inventoryUpdateParams).promise();

      // Return a success response
      return {
        statusCode: 200,
        body: JSON.stringify('Product and inventory data updated successfully'),
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
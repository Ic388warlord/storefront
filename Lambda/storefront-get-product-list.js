const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const client = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-get-product-list-lambda', async () => {
    const TABLE_PRODUCT = process.env.TABLE_PRODUCT;
    const TABLE_INVENTORY = process.env.TABLE_INVENTORY;

    let productIds = []

    //--------Extract all product_id from table--------//
    const getAllProductIdParams = {
      TableName: TABLE_PRODUCT,
      ProjectionExpression: 'product_id'
    };

    try {
      const data = await client.scan(getAllProductIdParams).promise();
      productIds = data.Items.map(item => item.product_id);
      // console.log("ProductIds: ", productIds);

    } catch (err) {
      console.error('Error grabbing all product_id: ', err);
      return {
        statusCode: 500,
        body: "ERROR: " + err
      };
    }

    //-------Grab the full set of data for each product_id-------//

    let allProducts = []

    for (const id of productIds) {

      const paramProduct = {
        TableName: TABLE_PRODUCT,
        Key: {
          'product_id': id,
        },
      };

      const paramInventory = {
        TableName: TABLE_INVENTORY,
        Key: {
          'product_id': id,
        },
      };

      try {
        const productResult = await client.get(paramProduct).promise();
        const inventoryResult = await client.get(paramInventory).promise();


        if (productResult && inventoryResult) {

          let itemJson = {
            "product_id": productResult.Item.product_id,
            "product_name": productResult.Item.product_name,
            "product_category": productResult.Item.product_category,
            "product_description": productResult.Item.product_description,
            "product_images": productResult.Item.product_images,
            "product_price": productResult.Item.product_price,
            "product_inventory": inventoryResult.Item.amount
          };

          allProducts.push(itemJson);
        }

      } catch (err) {

        console.error("ERROR: ", err);

        return {
          statusCode: 500,
          body: "ERROR: " + err
        }

      }
    }

    return {
      statusCode: 200,
      body: allProducts
    };
  });
};


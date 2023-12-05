const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const PRODUCT_TABLE_NAME = 'storefront_product';
const INVENTORY_TABLE_NAME = 'storefront_inventory';
const SHOPPING_CART_TABLE_NAME = 'storefront_shopping_cart';
const FAVORITE_PRODUCTS_TABLE_NAME = 'storefront_favorite_products';

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-delete-from-inventory-lambda', async () => {
    try {
      const product_id_to_remove = event.product_id;

      console.log(product_id_to_remove);
      if (!product_id_to_remove) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing product_id in the request' }),
        };
      }

      const product_params = {
        TableName: PRODUCT_TABLE_NAME,
        Key: {
          product_id: product_id_to_remove,
        },
      };

      const inventory_params = {
        TableName: INVENTORY_TABLE_NAME,
        Key: {
          product_id: product_id_to_remove,
        },
      };

      const shoppingCartParams = {
        TableName: SHOPPING_CART_TABLE_NAME,
        FilterExpression: 'product_id = :product_id',
        ExpressionAttributeValues: {
          ':product_id': product_id_to_remove,
        },
      };

      const scanFavoriteParams = {
        TableName: FAVORITE_PRODUCTS_TABLE_NAME,
      };

      const getProductResult = await dynamoDB.get(product_params).promise();

      if (!getProductResult.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Product with the specified product_id not found in product table.' }),
        };
      }

      const getInventoryResult = await dynamoDB.get(inventory_params).promise();

      if (!getInventoryResult.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Product with the specified product_id not found in inventory table.' }),
        };
      }

      await dynamoDB.delete(product_params).promise();
      await dynamoDB.delete(inventory_params).promise();

      const shoppingCartQueryResult = await dynamoDB.scan(shoppingCartParams).promise();

      console.log("shoppingCartQueryResult: ", shoppingCartQueryResult);

      for (const item of shoppingCartQueryResult.Items) {
        const deleteCartItemParams = {
          TableName: SHOPPING_CART_TABLE_NAME,
          Key: {
            cart_id: item.cart_id,
          },
        };
        await dynamoDB.delete(deleteCartItemParams).promise();
        console.log("removed item from shopping cart: ", item);
      }

      const scanFavoriteResult = await dynamoDB.scan(scanFavoriteParams).promise();

      for (const userFavorite of scanFavoriteResult.Items) {
        if (userFavorite.products && userFavorite.products.includes(product_id_to_remove)) {
          const updatedFavorites = userFavorite.products.filter(pid => pid !== product_id_to_remove);
          const updateFavoriteParams = {
            TableName: FAVORITE_PRODUCTS_TABLE_NAME,
            Key: {
              email: userFavorite.email,
            },
            UpdateExpression: 'set products = :products',
            ExpressionAttributeValues: {
              ':products': updatedFavorites,
            },
          };
          await dynamoDB.update(updateFavoriteParams).promise();
          console.log(`Updated favorite products for user: ${userFavorite.email}`);
        }
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Item removed from inventory and shopping cart successfully' }),
      };

    } catch (error) {

      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unhandled error' }),
      };

    }
  });
}
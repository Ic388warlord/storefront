const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'storefront_recent_products';


async function checkUserInDB(email) {

  try {
    const existingData = await client.get({
      TableName: tableName,
      Key: { email: email }
    }).promise()


    if (!existingData.Item) {
      const newEntry = {
        email: email,
        products: []
      }

      await client.put({
        TableName: tableName,
        Item: newEntry
      }).promise()
    }

  } catch (err) {
    console.error("Error: failed to check if user is in table: ", err)
  }
}


async function checkValidUser(email) {
  const cognitoClient = new AWS.CognitoIdentityServiceProvider();

  try {

    let params = {
      UserPoolId: 'us-west-2_zO0vwFtdU',
      Username: email
    }

    const userData = await cognitoClient.adminGetUser(params).promise();

    if (userData) {
      await checkUserInDB(email);
      return true
    }

  } catch (err) {
    if (err.code === 'UserNotFoundException') {
      return false
    } else {
      console.error("Error checking if user is in cognito: ", err)
    }
  }
}


exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-recent-products-add-lambda', async () => {
    try {
      const email = event.email;

      let validUser = await checkValidUser(email)

      if (!validUser) {
        return {
          statusCode: 400,
          body: { error: 'User does not exists' },
        };
      }

      const product_id = event.product_id;

      const existingData = await client.get({
        TableName: tableName,
        Key: { email },
      }).promise();

      const productList = existingData.Item?.products || [];
      console.log("existing products: ", productList)

      // Check if product_id is not already in the list
      if (!productList.includes(product_id)) {
        productList.unshift(product_id);

        if (productList.length > 5) {
          productList.pop();
        }

        console.log("after products: ", productList)

        // Update the DynamoDB row with the modified products list
        await client.put({
          TableName: tableName,
          Item: {
            email,
            products: productList,
          },
        }).promise();
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'successfully added product to recent products list' }),
      };
    } catch (error) {
      console.error('Error updating DynamoDB:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  });
};

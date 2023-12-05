const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'storefront_recent_products';

async function getRecentProducts(userEmail) {
  const params = {
    TableName: tableName,
    Key: {
      email: userEmail,
    },
  };

  try {
    const response = await client.get(params).promise();
    let products = response.Item.products || [];

    if (products.length == 0) {
      products = "No recently viewed items yet"
    }

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
  return AWSXRay.captureAsyncFunc('storefront-recent-products-lambda', async () => {
    try {
      console.log("EVENT: ", event)

      const email = event.email;

      let validUser = await checkValidUser(email)
      console.log("valid user: ", validUser)

      if (!validUser) {
        return {
          statusCode: 400,
          body: { error: 'User does not exists' },
        };
      }

      const result = await getRecentProducts(email);
      return result;

    } catch (err) {

      return {
        statusCode: 400,
        body: JSON.stringify(err),
      };
    }
  });
};

const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const client = new AWS.DynamoDB.DocumentClient();
const tableName = 'storefront_favorite_products';


async function addToFavorite(userEmail, product_id) {

  const params = {
    TableName: tableName,
    Key: {
      email: userEmail,
    },
  };

  try {
    const response = await client.get(params).promise();
    const products = response.Item.products || [];

    if (!products.includes(product_id)) {
      products.unshift(product_id);
    }


    await client.put({
      TableName: tableName,
      Item: {
        email: userEmail,
        products: products,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'successfully added product to favorite' }),
    };
  } catch (err) {
    console.log("Error adding new product to favorite: ", err);
    throw err;
  }
}

async function removeFromFavorite(userEmail, product_id) {
  const existingData = await client.get({
    TableName: tableName,
    Key: { email: userEmail },
  }).promise();

  const productList = existingData.Item?.products || [];

  const index = productList.indexOf(product_id);

  if (index !== -1) {
    productList.splice(index, 1);
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'product is not in favorite' }),
    };
  }


  // Update the DynamoDB row with the modified products list
  await client.put({
    TableName: tableName,
    Item: {
      email: userEmail,
      products: productList,
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'successfully removed product from favorite' }),
  };
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
        products: ["471d24c7-b72c-4493-9a98-ea842e323707", "5fedc436-45f3-48f1-8b55-0790927ac074"]
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
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    console.log(event);

    try {
      const operation = event.operation;
      const email = event.email;
      const product_id = event.product_id;

      let validUser = await checkValidUser(email)
      console.log("valid user: ", validUser)

      if (!validUser) {
        return {
          statusCode: 400,
          body: { error: 'User does not exists' },
        };
      }

      if (operation == "add") {
        return await addToFavorite(email, product_id);
      }

      if (operation == "remove") {
        return await removeFromFavorite(email, product_id);
      }

      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid operation' }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  });
};

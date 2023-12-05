const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const jwt_verify = require("aws-jwt-verify");

const USER_CLIENT_ID = process.env.USER_CLIENT_ID;
const ADMIN_CLIENT_ID = process.env.ADMIN_CLIENT_ID;
const USER_POOL_ID = process.env.USER_POOL_ID;

function extractUserEmail(userData) {
  const userAttributes = userData.UserAttributes;
  for (let i = 0; i < userAttributes.length; i++) {
    const attribute = userAttributes[i];
    if (attribute.Name === "email") {
      return attribute.Value;
    }
  }
}

async function getRole(authToken) {
  const userVerifier = jwt_verify.CognitoJwtVerifier.create({
    userPoolId: USER_POOL_ID,
    tokenUse: "access",
    clientId: USER_CLIENT_ID
  });

  try {
    await userVerifier.verify(authToken);
    return "USER";
  } catch (err) {
    return "ADMIN";
  }
}

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-api-auth-me-lambda', async () => {

    console.log(`EVENT: ${JSON.stringify(event)}`);

    const authToken = event.headers.Authorization;
    const userToken = event.body.userToken;

    if (!userToken) {
      return { statusCode: 400, error: "Invalid token", message: "Missing user token" };
    }

    try {
      const role = await getRole(authToken);

      const userInfo = await cognitoidentityserviceprovider.getUser({ AccessToken: userToken }).promise();
      console.log(`USER INFO: ${JSON.stringify(userInfo)}`);

      const email = extractUserEmail(userInfo);

      return { statusCode: 200, email, username: userInfo.Username, role };
    } catch (err) {
      return { statusCode: 400, error: "Invalid token", message: err.message };
    }
  });
};

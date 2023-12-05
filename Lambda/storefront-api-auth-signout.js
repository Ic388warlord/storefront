const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    console.log(`$EVENT: ${JSON.stringify(event)}}`);

    const userToken = event.body.userToken;

    if (!userToken) {
      return { statusCode: 400, error: "Invalid token", message: "Missing user token" };
    }

    const params = {
      AccessToken: userToken
    };

    try {
      const result = await cognitoidentityserviceprovider.globalSignOut(params).promise();
      console.log(`DATA: ${JSON.stringify(result)}`);
      return { statusCode: 200, message: "Successfully signed out" };

    } catch (err) {
      console.log(`ERR: ${err.message}`);

      return { statusCode: 400, error: "Sign out failed", message: err.message };
    }
  });
};
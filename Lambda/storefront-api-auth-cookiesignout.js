const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-cookiesignout-lambda', async () => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const token = event.user.token;

    const params = {
      AccessToken: token
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

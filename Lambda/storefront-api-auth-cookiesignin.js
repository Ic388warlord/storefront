const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const crypto = require('crypto');
const cookie = require("cookie");

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-cookiesignin-lambda', async () => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const body = event.body;

    const email = body.email;
    const password = body.password;

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    const hasher = crypto.createHmac('sha256', CLIENT_SECRET);
    hasher.update(`${email}${CLIENT_ID}`);
    const secretHash = hasher.digest('base64');

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        SECRET_HASH: secretHash,
        USERNAME: email,
        PASSWORD: password,
      },
    };

    try {
      const result = await cognitoidentityserviceprovider.initiateAuth(params).promise();
      console.log(`DATA: ${JSON.stringify(result)}`);

      const httpOnly = true;
      const maxAge = 60 * 60;
      const domain = "cwkc8gb6n1.execute-api.us-west-2.amazonaws.com";
      const path = "/stage/api";
      const sameSite = "none";
      const secure = true;

      const cookieToken = cookie.serialize("token", result.AuthenticationResult.AccessToken, { httpOnly, maxAge, domain, path, sameSite, secure });

      return { Cookie: cookieToken, Origin: event.headers.origin, statusCode: 200, message: "Successful signin" };
    } catch (err) {
      console.log(`ERR: ${err.message}`);

      return { statusCode: 400, error: "Signin failed", message: err.message };
    }
  });
};
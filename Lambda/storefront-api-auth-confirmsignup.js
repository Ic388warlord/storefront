const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const crypto = require('crypto');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const body = event.body;

  return AWSXRay.captureAsyncFunc('Storefront-api-auth-confirmsignup-lambda', async () => {
    const email = body.email;
    const confirmationCode = body.confirmationCode;

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    const hasher = crypto.createHmac('sha256', CLIENT_SECRET);
    hasher.update(`${email}${CLIENT_ID}`);
    const secretHash = hasher.digest('base64');

    const params = {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: secretHash,
    };

    try {
      const result = await cognitoidentityserviceprovider.confirmSignUp(params).promise();
      console.log(`DATA: ${JSON.stringify(result)}`);

      return { statusCode: 200, message: "Successfully confirmed account" };
    } catch (err) {
      console.log(`ERR: ${err.message}`);

      return { statusCode: 400, error: "Account confirmation failed", message: err.message };
    }
  });
};
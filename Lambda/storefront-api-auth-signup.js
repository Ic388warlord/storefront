const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const crypto = require('crypto');

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const body = event.body;

  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    const email = body.email;
    const password = body.password;

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;

    const hasher = crypto.createHmac('sha256', CLIENT_SECRET);
    hasher.update(`${email}${CLIENT_ID}`);
    const secretHash = hasher.digest('base64');

    const params = {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    try {
      const result = await cognitoidentityserviceprovider.signUp(params).promise();
      console.log(`DATA: ${JSON.stringify(result)}`);

      return { statusCode: 201, message: "Successfully signed up, please check your email for the confirmation code" };
    } catch (err) {
      console.log(`ERR: ${err.message}`);

      return { statusCode: 400, error: "Sign up failed", message: err.message };
    }
  });
};

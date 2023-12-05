const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));


exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {
    const params = {
      UserPoolId: 'us-west-2_zO0vwFtdU',
      AttributesToGet: ['email'],
    };


    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

    try {
      const userListResponse = await cognitoIdentityServiceProvider.listUsers(params).promise();

      const emails = userListResponse.Users.map(user => {
        const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
        return emailAttribute ? emailAttribute.Value : null;
      });

      console.log('User emails:', emails);

      // Return the user emails as a list in the response
      return {
        statusCode: 200,
        body: emails
      };
    } catch (error) {
      console.error('Error retrieving user emails:', error);

      // Handle the error appropriately
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      };
    }
  });
};
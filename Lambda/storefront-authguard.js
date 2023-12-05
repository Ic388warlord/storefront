const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const jwt_verify = require("aws-jwt-verify");
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-authguard-lambda', async () => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const token = extractBearerToken(event.authorizationToken);
    console.log(`TOKEN: ${token}`);

    if (!token) {
      return generatePolicy("user", "Deny", event.methodArn);
    }

    const verifier = jwt_verify.CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID,
      tokenUse: "access",
      clientId: process.env.CLIENT_ID
    });

    try {
      const payload = await verifier.verify(token);
      console.log(`PAYLOAD: ${JSON.stringify(payload)}`);

      const userInfo = await cognitoidentityserviceprovider.getUser({ AccessToken: token }).promise();
      console.log(`USER INFO: ${JSON.stringify(userInfo)}`);

      const userEmail = extractUserEmail(userInfo);
      const context = {
        username: userInfo.Username,
        email: userEmail,
        token
      };
      const policy = generatePolicy("user", "Allow", event.methodArn);
      policy["context"] = context;
      console.log(`ALLOW POLICY: ${JSON.stringify(policy)}`);

      return policy;
    } catch (err) {
      console.log(`ERR: ${err.message}`);
      return generatePolicy("user", "Deny", event.methodArn);
    }
  });
};

function generatePolicy(principal, effect, resource) {
  return {
    principalId: principal,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

function extractUserEmail(userData) {
  const userAttributes = userData.UserAttributes;
  for (let i = 0; i < userAttributes.length; i++) {
    const attribute = userAttributes[i];
    if (attribute.Name === "email") {
      return attribute.Value;
    }
  }
}

function extractBearerToken(authorizationToken) {
  if (!authorizationToken) return undefined;
  const [type, token] = authorizationToken.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
}
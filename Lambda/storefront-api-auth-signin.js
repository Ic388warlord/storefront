const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const crypto = require('crypto');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();


const axios = require('axios');

const USER_CLIENT_ID = process.env.USER_CLIENT_ID;
const USER_CLIENT_SECRET = process.env.USER_CLIENT_SECRET;
const ADMIN_CLIENT_ID = process.env.ADMIN_CLIENT_ID;
const ADMIN_CLIENT_SECRET = process.env.ADMIN_CLIENT_SECRET;
const USER_POOL_ID = process.env.USER_POOL_ID;

async function getGroupBasedToken(groups, code) {
  let clientId = "";
  let clientSecret = "";
  let role = "USER";

  if (groups.includes("AdminGroup")) {
    clientId = ADMIN_CLIENT_ID;
    clientSecret = ADMIN_CLIENT_SECRET;
    role = "ADMIN";
  } else {
    clientId = USER_CLIENT_ID;
    clientSecret = USER_CLIENT_SECRET;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await axios.post("https://storefront-api-auth.auth.us-west-2.amazoncognito.com/oauth2/token",
      { grant_type: "client_credentials", client_id: clientId },
      { headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": `Basic ${basic}` } }
    );
    console.log("AUTH TOKEN:", res.data.access_token);

    return { authToken: res.data.access_token, role };
  } catch (err) {
    return { error: "Signin failed", message: err.message };
  }
}

async function getGroups(accessToken) {
  const userInfo = await cognitoidentityserviceprovider.getUser({ AccessToken: accessToken }).promise();
  console.log("USER INFO:", userInfo);
  const username = userInfo.Username;

  const groups = await cognitoidentityserviceprovider.adminListGroupsForUser({ UserPoolId: USER_POOL_ID, Username: username }).promise();
  const groupNames = groups.Groups.map(group => group.GroupName);

  return groupNames;
}

async function getAccessToken(params) {
  try {
    const result = await cognitoidentityserviceprovider.initiateAuth(params).promise();
    console.log(`DATA: ${JSON.stringify(result)}`);

    const accessToken = result.AuthenticationResult.AccessToken;
    const idToken = result.AuthenticationResult.IdToken;
    const refreshToken = result.AuthenticationResult.RefreshToken;

    return { accessToken, idToken, refreshToken };
  } catch (err) {
    return { error: "Signin failed", message: err.message };
  }
}

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {

    console.log("EVENT:", event);

    const email = event.body.email;
    const password = event.body.password;

    const hasher = crypto.createHmac('sha256', USER_CLIENT_SECRET);
    hasher.update(`${email}${USER_CLIENT_ID}`);
    const secretHash = hasher.digest('base64');

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: USER_CLIENT_ID,
      AuthParameters: {
        SECRET_HASH: secretHash,
        USERNAME: email,
        PASSWORD: password,
      },
    };

    // Sign in with cognito, the access token containes the user info
    const resOne = await getAccessToken(params);
    if (resOne.error) {
      return { statusCode: 400, error: resOne.error, message: resOne.message };
    }

    // Gets the groups that the user is part of
    const groups = await getGroups(resOne.accessToken);
    console.log("GROUPS:", groups);

    // token to be used for authorization
    const resTwo = await getGroupBasedToken(groups);
    if (resTwo.error) {
      return { statusCode: 400, error: resTwo.error, message: resTwo.message };
    }

    const userToken = resOne.accessToken;
    const authToken = resTwo.authToken;
    const role = resTwo.role;

    return { statusCode: 200, message: "Successful signin", authToken, userToken, role, email };
  });
};
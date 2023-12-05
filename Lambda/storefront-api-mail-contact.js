const AWSXRay = require('aws-xray-sdk');
const aws = AWSXRay.captureAWS(require('aws-sdk'));
const ses = new aws.SES();

exports.handler = async function (event) {
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {

    console.log('EVENT:', event)

    const senderEmail = event.body.senderEmail;
    const subject = event.body.subject;
    const message = event.body.message;

    const params = {
      Destination: {
        ToAddresses: ["storefront.exclusivity@gmail.com"]
      },
      Message: {
        Subject: { Data: subject },
        Body: { Text: { Data: `From: ${senderEmail} - ${message}` } },

      },
      Source: "storefront.exclusivity@gmail.com",
      // ReplyToAddresses: [senderEmail]
    }

    try {
      const res = await ses.sendEmail(params).promise();
      console.log("RESULT:", res);

      return { statusCode: 200, message: "Email sent successfully" };
    } catch (err) {
      console.log("ERR:", err.message);
      return { statusCode: 500, error: "Failed to send email", message: err.message };
    }
  });
};
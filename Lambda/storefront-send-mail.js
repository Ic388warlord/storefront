const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const nodemailer = require("nodemailer");

async function verifyConnection(transporter) {
  try {
    await transporter.verify();
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-send-mail-lambda', async () => {

    const transporter = nodemailer.createTransport({
      host: "<HOST>",
      port: <PORT>,
      secure: true,
      auth: {
        user: "<USER>",
        pass: "<PASS>"
      }
    })

    const ok = verifyConnection(transporter);

    if (!ok) {
      return { statusCode: 500, error: "smtp server connection issues", message: "ahhhh" };
    }

    const mailOptions = {
      from: "storefront.exclusivity@gmail.com",
      to: "alexanderliu2016@gmail.com",
      subject: "Email Test",
      text: "This is a test email from nodemailer",
      html: "<p>This is a test email from nodemailer</p>"
    }

    try {
      const res = await transporter.sendMail(mailOptions);
      console.log("SUCCESS SEND:", res.response);
    } catch (err) {
      console.log("ERR SENDING:", err.message);
    }


    const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
  });
};

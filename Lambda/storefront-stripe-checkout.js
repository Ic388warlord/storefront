const AWSXRay = require('aws-xray-sdk');

exports.handler = async function (event, context) {
  return AWSXRay.captureAsyncFunc('storefront-stripe-checkout-lambda', async () => {

    console.log("event given", event)
    const stripe = require("stripe")("sk_test_51OE1VTIg25eUFBOp1SJEBzG4UWp9yXHZ8238QTjknz5HlExmD4WxLLfaYhNBfTYsSmRnzYDWtDMTzOtW2N9VTKOW004WjqLHuM");
    // console.log(JSON.parse(event['body']))

    // var payload = JSON.parse(event['body'])

    // return {
    //   statusCode: 200, // http status code
    //   body: JSON.stringify({
    //     paymentIntent
    //   }),
    // };
    const amount = parseInt(event['amount'])
    const currency = event['currency']

    // const amount = payload['amount']
    // const currency = payload['currency']

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      console.log(paymentIntent)

      return {
        isBase64Encoded: false,
        body: {
          clientSecret: paymentIntent.client_secret
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 200
      };
    } catch (e) {
      // handle errors
      console.log("yah that didnt seem to work", e)
      return {
        isBase64Encoded: false,
        body: {
          error_message: e
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        statusCode: 403
      };
    }
  });
};


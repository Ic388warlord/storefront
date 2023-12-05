const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const Lex = new AWS.LexRuntimeV2();

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-api-chatbot-chat-lambda', async () => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const text = event.body.text;

    const params = {
      botAliasId: process.env.BOT_ALIAS_ID,
      botId: process.env.BOT_ID,
      localeId: "en_US",
      sessionId: "user",
      text
    };

    try {
      const result = await Lex.recognizeText(params).promise();
      console.log(`RESULT: ${JSON.stringify(result)}`);

      return { statusCode: 200, message: "Successfully got message from Lex", lexResponse: result.messages[0].content };
    } catch (err) {
      console.log(`ERR: ${JSON.stringify(err)}`);

      return { statusCode: 400, error: "Lex error", message: err.message };
    }
  });
};
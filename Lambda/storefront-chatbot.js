const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const crypto = require('crypto');

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-chatbot-lambda', async () => {
    console.log("EVENT:", JSON.stringify(event, null, 2));

    const intentName = event.sessionState.intent.name;
    const originalText = event.inputTranscript;
    const slots = event.sessionState.intent.slots;

    const CHATBOT_STATE_MACHINE_ARN = process.env.CHATBOT_STATE_MACHINE_ARN;

    const stepfunctions = new AWS.StepFunctions();

    const startExecutionParams = {
      stateMachineArn: CHATBOT_STATE_MACHINE_ARN,
      input: JSON.stringify({ intentName, originalText, slots }),
    };

    const startExecutionResponse = await stepfunctions.startExecution(startExecutionParams).promise();
    const executionArn = startExecutionResponse.executionArn;

    const describeExecutionParams = {
      executionArn: executionArn,
    };

    let executionStatus = "RUNNING";

    // Polling until its done executing
    while (executionStatus === "RUNNING") {
      const describeExecutionResponse = await stepfunctions.describeExecution(describeExecutionParams).promise();
      executionStatus = describeExecutionResponse.status;

      setTimeout(() => { }, 1000);
    }

    const describeExecutionResponse = await stepfunctions.describeExecution(describeExecutionParams).promise();
    console.log("OUTPUT:", describeExecutionResponse.output);
    const finalResult = JSON.parse(describeExecutionResponse.output);

    return finalResult;
  });
};

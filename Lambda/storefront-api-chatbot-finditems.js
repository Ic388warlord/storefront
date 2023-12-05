const AWSXRay = require('aws-xray-sdk');

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  return AWSXRay.captureAsyncFunc('Storefront-api-chatbot-finditems-lambda', async () => {
    const items = [{ type: "clothing", name: "black jacket" }, { type: "clothing", name: "blue shirt" }, { type: "clothing", name: "grey shirt" }];

    const response = {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          name: event.sessionState.intent.name,
          state: ""
        }
      },
      messages: []
    }

    const slots = event.sessionState.intent.slots;
    const slotProductType = slots.ProductType;
    const value = slotProductType.value.resolvedValues.length > 0 ? slotProductType.value.resolvedValues[0] : slotProductType.originalValue;

    const found = items.filter(item => item.type === value);

    if (found.length > 0) {
      const mappedToStringArray = found.map(item => `[Type: ${item.type} | Name: ${item.name}]`);

      response.messages = [{ contentType: "PlainText", content: `Results: ${mappedToStringArray.join(", ")}` }];
      response.sessionState.intent.state = "Fulfilled";
    } else {
      response.messages = [{ contentType: "PlainText", content: "Could not find any items" }];
      response.sessionState.intent.state = "Failed";
    }

    return response;
  });
};

const AWSXRay = require('aws-xray-sdk');

function handleFindItem(event) {
  const items = [{ type: "clothing", name: "black jacket" }, { type: "clothing", name: "blue shirt" }, { type: "clothing", name: "grey shirt" }];

  const intentName = event.intentName;
  const slots = event.slots;
  const slotProductType = slots.ProductType;

  const value = slotProductType.value.resolvedValues.length > 0 ? slotProductType.value.resolvedValues[0] : slotProductType.originalValue;

  const found = items.filter(item => item.type === value);

  if (found.length > 0) {
    const mappedToStringArray = found.map(item => `[Type: ${item.type} | Name: ${item.name}]`);
    return generateLexResponse(intentName, "Fulfilled", `Results: ${mappedToStringArray.join(", ")}`);
  } else {
    return generateLexResponse(intentName, "Failed", "Could not find any items");
  }
}

function generateLexResponse(intentName, state, message) {
  /* 
  State: Fulfilled, Failed
  */
  const response = {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intentName,
        state
      }
    },
    messages: []
  }

  response.messages = [{ contentType: "PlainText", content: message }];

  return response;
}

exports.handler = async (event) => {
  return AWSXRay.captureAsyncFunc('storefront-chatbot-find-product-lambda', async () => {

    console.log("EVENT:", JSON.stringify(event, null, 2));
    return handleFindItem(event);
  });
};

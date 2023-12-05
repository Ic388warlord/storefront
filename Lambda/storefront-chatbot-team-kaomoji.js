const AWSXRay = require('aws-xray-sdk');

function handleDisplayTeamMember(event) {
  const intentName = event.intentName;
  const name = event.originalText.toLowerCase();

  switch (name) {
    case "cody": {
      return generateLexResponse(intentName, "Fulfilled", "ᕙ(▀̿̿ĺ̯̿̿▀̿ ̿) ᕗ");
    }
    case "wendy": {
      return generateLexResponse(intentName, "Fulfilled", "ʕ´•ᴥ•.`ʔ");
    }
    case "alex": {
      return generateLexResponse(intentName, "Fulfilled", "₍^ >ヮ<^₎");
    }
    case "gareth": {
      return generateLexResponse(intentName, "Fulfilled", "໒( ಥ Ĺ̯ ಥ )७");
    }
    case "ben": {
      return generateLexResponse(intentName, "Fulfilled", "((.′◔_′◔.))");
    }
    case "april": {
      return generateLexResponse(intentName, "Fulfilled", "( ͡◉ ͜ʖ ͡◉)");
    }
    case "matthew": {
      return generateLexResponse(intentName, "Fulfilled", "( ▀ ͜͞ʖ▀)");
    }
    case "ray": {
      return generateLexResponse(intentName, "Fulfilled", "༼ಢ_ಢ༽");
    }
    case "kris": {
      return generateLexResponse(intentName, "Fulfilled", "(˵ ͡~ ͜ʖ ͡°˵)ﾉ⌒♡*:・。.");
    }
    case "team": {
      return generateLexResponse(intentName, "Fulfilled", "ᕙ(▀̿̿ĺ̯̿̿▀̿ ̿) ᕗ\n ʕ´•ᴥ•.`ʔ\n ₍^ >ヮ<^\n ໒( ಥ Ĺ̯ ಥ)७\n ((.′◔_′◔.))\n ( ͡◉ ͜ʖ ͡◉) \n ( ▀ ͜͞ʖ▀)\n ༼ಢ_ಢ༽\n (˵ ͡~ ͜ʖ ͡°˵)ﾉ⌒♡*:・。.");
    }
  }

  return generateLexResponse(event.sessionState.intent.name, "Fulfilled", "Testing");
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
  return AWSXRay.captureAsyncFunc('Storefront-api-auth-signup-lambda', async () => {

    console.log("EVENT:", JSON.stringify(event, null, 2));
    return handleDisplayTeamMember(event);
  });
};
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');
const persistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName: 'ShoppingList',
  createTable: true
});

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return new Promise((resolve, reject) => {
      handlerInput.attributesManager.getPersistentAttributes()
        .then((attributes) => {
          const { list } = attributes;

          let speechText = 'Welcome to shopping list. Add something to get started.';

          if (typeof list !== 'undefined') {
            speechText = 'You have ' + list.length + ' items on your shopping list: ' + list.join();
          }

          resolve(handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Welcome', speechText)
            .getResponse());
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
};

const ListIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ListIntent';
  },
  handle(handlerInput) {
    return new Promise((resolve, reject) => {
      handlerInput.attributesManager.getPersistentAttributes()
        .then((attributes) => {
          const { list } = attributes;

          let speechText = 'Your shopping list is empty. Add something to get started';

          if (typeof list !== 'undefined' && list.length > 0) {
            speechText = 'You have ' + list.length + ' items on your shopping list: ' + list.join();
          }

          resolve(handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('List', speechText)
            .getResponse());
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
};

const AddIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AddIntent';
  },
  async handle(handlerInput) {
    const item = handlerInput.requestEnvelope.request.intent.slots.item.value;
    let speechText = 'Adding ' + item + ' to your shopping list';
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    let { list } = attributes;
    if (list == undefined) {
      list = [item];
    } else {
      list.push(item);
    }
    attributes['list'] = list;
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    await handlerInput.attributesManager.savePersistentAttributes();
   
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Add', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'I can help you track your shopping list! Just tell me what to add!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Help', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Goodbye', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AddIntentHandler,
    ListIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .withPersistenceAdapter(persistenceAdapter)
  .addErrorHandlers(ErrorHandler)
  .lambda();

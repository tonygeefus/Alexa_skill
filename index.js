
// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const db= require('reqdata.js');

const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const reqdata=db.maindata;
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        let cust = persistentAttributes.cust;
        let datee=persistentAttributes.datee;
        let comp=persistentAttributes.comp;
        let prevdatee=persistentAttributes.prevdatee;
        const dayNumber = dayOfTheYear();
        let speakOutput='Welcome back, do you want to learn today\'s words, or test you  with last learned words   ';
        
        
         if(cust === undefined){
         const dataToSave = {"cust":"customer","datee":dayNumber,"prevdatee":dayNumber-1}
         save(handlerInput, dataToSave, null);
         speakOutput='Welcome to daily vocab skill,this skill will teach you three new words a day and, will test you on the words teached on the previous day,if you want to learn today\'s word say ,give me today\'s words or, if you want to take the test say test me ';
             
         }
         else
         if(datee!==dayNumber )
       {  const dataToSave={"cust":"customer","datee":dayNumber,"prevdatee":dayNumber-1,"comp":"notcompleted"}
            save(handlerInput, dataToSave, null);
            speakOutput = 'Welcome back, do you want to learn today\'s words, or, test you  with last learned words   '}
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


function save(handlerInput, attributesToSave, attributesToDelete) {
    return new Promise((resolve, reject) => {
        handlerInput.attributesManager.getPersistentAttributes()
            .then((attributes) => {
                for (let key in attributesToSave) {
                    attributes[key] = attributesToSave[key];
                }
                if (null !== attributesToDelete) {
                    attributesToDelete.forEach(function (element) {
                        delete attributes[element];
                    });
                }
                handlerInput.attributesManager.setPersistentAttributes(attributes);

                return handlerInput.attributesManager.savePersistentAttributes();
            })
            .catch((error) => {
                reject(error);
            });
    });
}


function dayOfTheYear(){
    let dt = new Date();
    let first = new Date(dt.getFullYear(), 0, 0);
    let difference = dt - first ;
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(difference / oneDay);
    return day;
}


const TeachIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TeachIntent';
    },
   async handle(handlerInput) {
        const dayNumber = dayOfTheYear();
        console.log(dayNumber);
        const qn1=reqdata[3*dayNumber -2].words;
        const qn2=reqdata[3*dayNumber -1].words;
        const qn3=reqdata[3*dayNumber].words;
        const ans1=reqdata[3*dayNumber -2].meanings;
        const ans2=reqdata[3*dayNumber -1].meanings;
        const ans3=reqdata[3*dayNumber].meanings;
        let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
         let comp = persistentAttributes.comp;
       let datee = persistentAttributes.datee ;
       let prevdatee = persistentAttributes.prevdatee;
        
        let speakOutput ='First word is '+'<break time="1s"/> ' +qn1+'<break time="0.5s"/>'+'<say-as interpret-as="spell-out">'+qn1+'</say-as>'+'<break time="1s"/> '+' means,'+ans1+'<break time="2s"/>' +'Second  word is'+'<break time="1s"/> ' +qn2+'<break time="0.5s"/>'+'<say-as interpret-as="spell-out">'+qn2+'</say-as>'+'<break time="1s"/> '+' means,'+ans2+'<break time="2s"/>'+'last word is '+'<break time="1s"/> ' +qn3+'<break time="0.5s"/>'+'<say-as interpret-as="spell-out">'+qn3+'</say-as>'+'<break time="1s"/> '+' means,'+ans3+'<break time="2s"/>'+'Do you want to repeat me or test you with previous day\'s words';
        
        
        
    //     return handlerInput.responseBuilder
    // .addDelegateDirective({
    //     name: 'QuestionIntentHandler',
    //     confirmationStatus: 'NONE',
    //     slots: {}
    // })
    // .speak(speakOutput)
    // //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
    // .getResponse();
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('If you want to attend the test say test me')
            .getResponse();
    }
};
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const QuestionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuestionIntent';
    },
   async handle(handlerInput) {
         let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
         let prevdatee = persistentAttributes.prevdatee;
         let comp = persistentAttributes.comp;
         let speakOutput='';
         if(comp === undefined)
         { speakOutput='This is your first day,no problem try out yesterday\'s words,Are you ready for the quiz?'; 
         const dataToSave4={"comp":"notcompleted"}
            save(handlerInput, dataToSave4, null);
             
         }
         else
         if(comp==="todayover" )
         {
             speakOutput='You have finished the test come back tommorow';
               return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('But still you can learn Today\'s word ')
            .getResponse();
         }else
         speakOutput='Are you ready for the quiz?'
       
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('sorry,i think that\'s not an option')
            .getResponse();
    }
};










         


const YesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent';
            
            
    },
   async handle(handlerInput) {
        
        let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const qno = sessionAttributes.next || "1";
        let comp = persistentAttributes.comp;
        let prevdatee = persistentAttributes.prevdatee;
        if(comp==="todayover" )
         {
             speakOutput='You have finished the test come back tommorow';
               return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
         }
        else
        if(qno==="1")
        {
            console.log("HI")
    //         const dataToSave = {
    //         "next": "2"
    //     }
    //   handlerInput.attributesManager.setSessionAttributes(dataToSave);
       
        let op1=getRandomInt(0,3*prevdatee-3);
        let op2=3*prevdatee-2;
        let op3=3*prevdatee-1;
        let arr=[op1,op2,op3]
        arr=shuffle(arr);
        const dataToSave2={
            "qnarray" :arr,
            "next" :"2"
        }
        handlerInput.attributesManager.setSessionAttributes(dataToSave2);
        
        

        }
        else
        if(qno === "2")
        {
            
    //         const dataToSave = {
    //         "next": "3"
    //     }
    //   handlerInput.attributesManager.setSessionAttributes(dataToSave);
        
        let op1=getRandomInt(0,3*prevdatee -3);
        let op3=3*prevdatee-1;
        let op2=3*prevdatee;
        let arr=[op1,op2,op3]
        arr= shuffle(arr);
        const dataToSave2={
            "qnarray" :arr,
            "next" :"3"
        }
        handlerInput.attributesManager.setSessionAttributes(dataToSave2);
        
        

        }
         else
        if(qno === "3")
        {
            
    //         const dataToSave = {
    //         "next": null
    //     }
    //   handlerInput.attributesManager.setSessionAttributes(dataToSave);
       const dataToSave3 = {
                "comp": "todayover"
                
            }       
                save(handlerInput, dataToSave3, null);
        let op3=getRandomInt(0,3*prevdatee -3);
        let op2=getRandomInt(0,3*prevdatee -3);
        if(op2===op3)
        op2=op2-1;
        let op1=3*prevdatee;
        let arr=[op1,op2,op3]
        arr= shuffle(arr);
        const dataToSave2={
            "qnarray" :arr,
            "next" :"4"
        }
        handlerInput.attributesManager.setSessionAttributes(dataToSave2);
        
        

        }
        
         let speakOutput=''
        const sessionAttributes2 = handlerInput.attributesManager.getSessionAttributes();
      
        const qnoo = parseInt(sessionAttributes2.next);
        const arrx=sessionAttributes2.qnarray;
        console.log(prevdatee)
        console.log(3*prevdatee-qnoo+4)
         speakOutput='<break time="1s"/> '+'Here Goes Question '+ String(qnoo-1)+'<break time="1s"/> ' +reqdata[(3*prevdatee)-4 + qnoo].meanings+'<break time="1s"/> '+',the options are,'+'option one,'+reqdata[arrx[0]].words+'<break time="0.5s"/>'+'option two,'+reqdata[arrx[1]].words+'<break time="0.5s"/>'+'option three,'+reqdata[arrx[2]].words;   
         if(qnoo===2)
         {let addx='Just say the option number';
         speakOutput=addx+speakOutput;
         }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('There is only three option say any')
            .getResponse();
    }
};








const NoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent';
            
            
    },
    handle(handlerInput) {
        
        let speakOutput='If you want to learn today\'s word say ,give me today\'s words or, if you want to take the test say test me ';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('If you want to learn today\'s word say ,give me today\'s words or, if you want to take the test say test me ')
            .getResponse();
    }
};




















const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
    },
   async handle(handlerInput) {
        let persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
          const userchoice = handlerInput.requestEnvelope.request.intent.slots.answer.value;
            let prevdatee = parseInt(persistentAttributes.prevdatee);
            if(parseInt(userchoice)>3)
            {
              let  so='Please choose a valid option ';
                return handlerInput.responseBuilder
            .speak(so)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
            }
            console.log("prev")
            console.log(prevdatee)
          const qnno=parseInt(sessionAttributes.next);
           console.log("next")
            console.log(qnno)
          const arrx=sessionAttributes.qnarray;
          const usera= arrx[parseInt(userchoice)-1];
           console.log("usera")
            console.log(usera)
         const userans= reqdata[usera].words;
          console.log("useran")
            console.log(prevdatee)
            console.log(3*prevdatee)
            console.log((3*prevdatee)-4 + qnno)
            console.log(reqdata[(3*prevdatee)-4 + qnno])
            
         const correctans=reqdata[(3*prevdatee)-4 + qnno].words;
          console.log("correctans")
            console.log(correctans)
         let sus=''
         if(userans===correctans)
         {sus='CORRECT <audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_01"/>'
             
         }else
         {
            sus='wrong,' +'correct answer is '+correctans; 
         }
         console.log("1")
         console.log(sus)
         console.log(correctans)
        console.log(userans)
         let speakOutput=sus +',Are you ready for next question?';
        if(qnno===4)
        speakOutput=sus +'You have finished your test come back tommorow,To learn today\'s word say teach me.'
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};





const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = ' If you want to learn today\'s word say ,give me today\'s words or, if you want to take the test say test me ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};






















// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName: process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        LaunchRequestHandler,
        TeachIntentHandler,
        HelpIntentHandler,
        AnswerIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        QuestionIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();

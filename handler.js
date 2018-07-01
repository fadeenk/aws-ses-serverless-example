'use strict';

// importing AWS sdk
import AWS from 'aws-sdk';
// importing config file which contains AWS key
// Best practice: to use a config.copy.json when pushing to github
// Coz exposing the AWS keys to public is not good
import config from './config.json';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

// Instatiating the SES from AWS SDK
let ses = new AWS.SES();

// Structure of sendMail params structure:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property

// The function to send SES email message
module.exports.sendMail = (event, context, callback) => {

  let toArray = event.body.to;
  let bodyString = event.body.body;
  let subjectString = event.body.subject;
  let sourceString = event.body.from;
  let replyToString = event.body.replyTo;

// The parameters for sending mail using ses.sendEmail()
  let emailParams = {
    Destination: {
      ToAddresses: toArray
    },
    Message: {
      Body: {
        Text: {
          Data: bodyString,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: subjectString,
        Charset: 'UTF-8'
      }
    },
    Source: sourceString,
    ReplyToAddresses: [replyToString]
  };

  console.log(emailParams);

// the response to send back after email success.
  const response = {
    statusCode: 200,
    body: {
      success: true,
      message: 'Mail sent successfully'
    },
  };

// The sendEmail function taking the emailParams and sends the email requests.
  ses.sendEmail(emailParams, function (err, data) {
      if (err) {
          console.log(err, err.stack);
          callback(err);
      } else {
        console.log("SES successful");
        console.log(data);
        callback(null, response);
      }
  });
};

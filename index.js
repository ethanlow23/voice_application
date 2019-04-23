const express = require('express');
const app = express();

const dialogflow = require('dialogflow');
const uuid = require('uuid');

app.use(express.static(__dirname + '/static'));

const server = app.listen(3000, () => {
    console.log('listening on port 3000');
});

const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('user_msg', (data) => {
        getResponse('newagent-e98f2', data).then((aiText) => {
            socket.emit('bot_msg', aiText);
        });
    });
});

async function getResponse(projectId, text) {
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: 'en-US',
            }
        }
    };
    try {
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
        } else {
        console.log(`  No intent matched.`);
        };
        return result;
    } catch (err) {
        console.log('did not work');
        return 'I am broken. Try again';
    }
};
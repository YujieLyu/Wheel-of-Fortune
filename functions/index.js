const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const app = require('express')();

const { response } = require('express');

//without cors, frontend can't retreive data
const cors = require('cors');
app.use(cors({ origin: true }));


const { getAll } = require('./APIs/candidates');

app.get('/all', getAll);

const { getStandupCan } = require('./APIs/candidates');

app.get('/standup', getStandupCan);

const { getRetroCan } = require('./APIs/candidates');

app.get('/retro', getRetroCan);

const { getSprintPlanCan } = require('./APIs/candidates')

app.get('/sprint-plan', getSprintPlanCan)

const { addNew } = require('./APIs/candidates');

app.post('/new', addNew);

const { addNewStandupCan } = require('./APIs/candidates');

app.post('/newStandupCan', addNewStandupCan);

const { addNewRetroCan } = require('./APIs/candidates');

app.post('/newRetroCan', addNewRetroCan);

const { addNewSprintplanCan } = require('./APIs/candidates');

app.post('/newSprintplanCan', addNewSprintplanCan);

const {deleteStandupCan}=require('./APIs/candidates');

app.delete('/sirius-standup/:id',deleteStandupCan);

const {deleteRretroCan}=require('./APIs/candidates');

app.delete('/sirius-retro/:id',deleteRretroCan);

const {deleteSprintplanCan}=require('./APIs/candidates');

app.delete('/sirius-sprintplan/:id',deleteSprintplanCan)

const {deleteCan}=require('./APIs/candidates');

app.delete('/sirius-all/:id',deleteCan)

const { getColors } = require('./APIs/colors');

app.get('/colors', getColors)

exports.api = functions.https.onRequest(app);

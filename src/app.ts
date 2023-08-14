import express from 'express';
import cors from 'cors';
import * as scheduler from './helper/scheduler.misc'

// Import middleware
import { router } from './routes/index';
import matchService from './services/match.service';
// Create app using express
const app = express();


// Create generic header for response
app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Set app to use json format
// app.use(bodyParser.json()); DEPRACATED express has now his own json parser
app.use(express.json()); // permet à l'API de répondre au format JSON

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Allow cross domain
app.use(cors());

// Set app routes
app.use('/', router);

// Test route
app.get('/authorized', (req, res) => {
    res.send('Secured Resource');
});

// schedule tasks to be run on the server
// scheduler.scheduleTask({
//     "id": "update-match-each-night",
//     "cronExpression": "0 */12 * * *",
//     action: async () => {
//         console.log('fetch and create or update matches');
//         await matchService.fetchAndCreateOrUpdateMatches();
//     },
// });


// scheduler.scheduleTask({
//     "id": "update-ended-match-each-5-minutes",
//     "cronExpression": "*/5 8-23 * * *",
//     action: async () => {
//         console.log('update ended matches');
//         await matchService.updateEndedMatches();
//     },
// });

// scheduler test
// scheduler.scheduleTask({
//     "id": "test-update-match-each-30-secondes",
//     "cronExpression": "*/30 * * * * *",
//     action: async () => {
//         console.log('test update match each 30 secondes');
//         await matchService.fetchAndCreateOrUpdateMatches();
//     },
// });



export default app;

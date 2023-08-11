import express from 'express';
import cors from 'cors';;

// Import middleware
import { router } from './routes/index';
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

export default app;

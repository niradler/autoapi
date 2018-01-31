const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const env = require('dotenv').config();
const ApiController = require('./controllers/ApiController')

app.use(cors())
app.use(bodyParser.json());

app.all('/:table/:index', ApiController);
app.all('/:table', ApiController);

app.get('/test', (req, res) => {
    return res.send('auto api is live!')
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
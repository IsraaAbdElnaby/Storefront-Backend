import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())

var corsOptions = {
    origin: 'http://storefront.com',
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

app.get('/products/:id', cors(corsOptions), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for only example.com.'})
})




app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})

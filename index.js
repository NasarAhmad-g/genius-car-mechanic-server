const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors =require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

//middleWare
app.use(cors());
app.use(express.json());



//connect to database user and pass
const uri = `mongodb+srv://${process.env.DB_USERR}:${process.env.DB_PASS}@cluster0.aedqf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//insert a Document [mongodb->resource->insert option->insert a document]
async function run(){
    try{
        //server to db connection[]
        await client.connect();
        
        //database name/create name[]
        const database = client.db('carMachanic');
        // Collection name/create name[]
        const serviceCollection = database.collection('services');
         
        //GET API 
        app.get('/services', async(req, res) => {
            const coursor = serviceCollection.find({});
            const services = await coursor.toArray();
            res.send(services);
        });

        //GET single Api
        app.get('/services/:id', async (req, res)=> {
            const id = req.params.id;
            console.log('hitting id',id)
            const query = {_id: ObjectId(id) };
            const services = await serviceCollection.findOne(query);
            res.json(services);
        })

        //POST API [call and save to database]
        app.post('/services', async (req, res)=>{

            const service = req.body;
            console.log('hit the db', service);
            
            //create json data[]
            // const service ={
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg",
            // }

            // form data server to send database[]
            const result = await serviceCollection.insertOne(service);
            console.log('back to db', result);
            res.json(result);
        });


        // DELETE API

        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId (id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}


run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('default route cheacked');
});

app.listen(port, ()=>{
    console.log('default route is running', port);
})
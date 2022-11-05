const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kdtr5cm.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const productCollection = client.db("emaJhon").collection("products");
        app.get('/products', async(req, res) =>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            // console.log(page, size);
            const query = {};
            const cursor = productCollection.find(query);
            // const products = await cursor.toArray();
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count, products});
        })

        app.post('/productsBySelectedIds', async(req, res) =>{
            const selectedIds = req.body;
            const objectIds = selectedIds.map(id => ObjectId(id));
            const query = {_id: {$in: objectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }finally{

    }
}
run().catch(error => console.error(error))

app.get('/', (req, res) =>{
    res.send('Ema jhon sever is running');
})

app.listen(port, () =>{
    console.log(`Ema jhon running on ${port}`);
})
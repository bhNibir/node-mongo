const express = require('express')
require('dotenv').config()
const app = express()
const port = 4200
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;

const uri = process.env.DB_PATH
let client = new MongoClient(uri, { useNewUrlParser: true });

app.use(cors())
app.use(bodyParser.json())

const names = ["Babu", "Nibir", "Biplob", "Hasan"]

app.get('/products' , (req,res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("commerce").collection("products");
          collection.find().toArray((err, documents) => {
             if(err){
                 console.log(err);
                 res.status(500).send({message:err})
                 
             }
             else{
                 res.send(documents)
             }
          })
          
        client.close();
      });
})





app.get('/product/:key', (req, res) => {
    const key = req.params.key

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("commerce").collection("products");
          collection.find({key}).toArray((err, documents) => {
             if(err){
                 console.log(err);
                 res.status(500).send({message:err})
                 
             }
             else{
                 res.send(documents[0])
             }
          })
          
        client.close();
      });
})

app.post('/productReviewByKey', (req, res) => {
    const productKeys = req.body
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("commerce").collection("products");
          collection.find({'key' : { $in :productKeys }}).toArray((err, documents) => {
             if(err){
                 console.log(err);
                 res.status(500).send({message:err})
                 
             }
             else{
                 res.send(documents)
             }
          })
          
        client.close();
      });
})


app.post('/addProduct', (req,res) => {
    const product = req.body

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("commerce").collection("products");
          collection.insert(product,(err, result) => {
             if(err){
                 console.log(err);
                 res.status(500).send({message:err})
                 
             }
             else{
                 res.send(result.ops[0])
             }
          })
          
        client.close();
      });
    
})

app.post('/placeOrder', (req,res) => {
    const productDetails = req.body
    productDetails.orderTime = new Date()
    console.log(productDetails)
    client = new MongoClient(uri, { useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("commerce").collection("orders");
          collection.insertOne(productDetails,(err, result) => {
             if(err){
                 console.log(err);
                 res.status(500).send({message:err})
                 
             }
             else{
                 res.send(result.ops[0])
             }
          })
          
        client.close();
      });
    
})

app.listen(port, () => {console.log(`App listening ${port}`)})
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const password = '7KPa5LSTrxUJ6yen';

const uri = "mongodb+srv://organicUser:7KPa5LSTrxUJ6yen@cluster0.y5kfv.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

// Read And Send Data
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/products', (req, res)=>{
    productCollection.find({})
    .toArray((error , document)=>{
      res.send(document);
    })
  })

  app.get('/singleProduct/:id', (req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((error, document)=>{
      res.send(document[0]);
    })
  })

  app.post("/addProduct", (req, res)=>{
    const product = req.body;
    // console.log(product);
    productCollection.insertOne(product)
    .then(result=>{
      console.log("Product Added Successfully");
      res.send("Created Successfully");
    })

  })

  app.patch('/update/:id', (req, res)=>{
    productCollection.updateOne({_id : ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result=>{
      console.log(result);
    })
  })

  app.delete("/delete/:id", (req, res)=>{
    // console.log(req.params.id);
    productCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result=>{
      console.log(result);
    })
  })
});


app.listen(3000);

 // collection.insertOne(product)
  // .then(result=>{
    //   console.log('Product Added successfully');
    //   res.send('Created successfully');

  // const product = {name: 'Mango' , price: 120, quantity: 20}
  // collection.insertOne(product)
  // .then(result =>{
  //     console.log('Product Added successfully');
  // });
  // console.log('database created');
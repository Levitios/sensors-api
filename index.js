//Import depencies express
const express = require('express');
require("dotenv").config();

//Initialize express
const app = express();

//Read JSON
app.use(express.json());

//MONGODB Connect
const db = require("./models");
db.mongoose
  .connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

//Routes
app.get("/sensors", (req, res) => {
  res.status(200).json({message:"true"});
});

app.get("/sensor/:id", (req, res) => {
    var id = req.params.id;
    db.sensor.findOne({id:id})
    .then((sensor)=>{
        res.status(200).json({message:sensor});
    }).catch((err)=>{
        res.status(404).json({message:"Sensor not exist !"});
    });
});

app.post("/sensor", (req, res) => {
    var newSensor = {
        id: req.body.id,
        type: req.body.type,
        datas: req.body.datas,
        metrics: req.body.metrics
    };
    db.sensor.findOne({id:newSensor.id})
    .then((sensor)=>{
        if(sensor){
            res.status(409).json({message:"Sensor already exist !"});
        }else{
            db.sensor.create(newSensor)
            .then((success)=>{
                res.status(201).json({message:`Sensor id:${newSensor.id} create !`});
            })
            .catch((err)=>{
                res.status(500).json({message:err});
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({message:err});
    });
});

app.put("/sensor/:id", (req, res) => {
    var idSensor = req.params.id;
    var putSensor = {
        type: req.body.type,
        datas: req.body.datas,
        metrics: req.body.metrics
    };
    db.sensor.findOneAndUpdate({id:idSensor},putSensor)
    .then((success)=>{
        res.status(200).json({message:`Sensor update !`});
    }).catch((err)=>{
        res.status(404).json({message:`Sensor not found !`});
    }); 
});

app.delete("/sensor/:id", (req, res) => {
    var idSensor = req.params.id;
    db.sensor.findOneAndDelete({id: idSensor})
    .then((success)=>{
        res.status(200).json({message:`Sensor Delete !`});
    })
    .catch((err)=>{
        res.status(404).json({message:`Sensor not found !`});
    });
});

//APP Listen port 3000
app.listen(3000, () => {
    console.log(`Server is running on port 3000.`);
});
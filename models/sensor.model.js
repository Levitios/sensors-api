const mongoose = require("mongoose");

const Sensor = mongoose.model(
  "Sensor",
  new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    datas:{
        type: Array,
        required: true
    },
    metrics: Boolean
  })
);

module.exports = Sensor;
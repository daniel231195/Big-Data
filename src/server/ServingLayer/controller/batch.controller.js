const axios = require("axios");
const jsonfile = require("jsonfile");



let modelInfo = {};
let dataSetInfo = {};

/**
 * @description Gets the model info
 */
const getModelInfo = async (req, res) => {
    console.log("getting model info.......");
    try{
        const call = await axios.get(`http://localhost:3003/api/modelInfo`);
        res.status(200).json({
            message: "get model info success",
        })
        modelInfo = call
        console.log(modelInfo)
    }catch (error){
        res.status(400).send("Model not make");
    }

};
const getDataSet = async (req, res) => {
    console.log("getting data set info.......");
    try{
        const call = await axios.get(`http://localhost:3003/api/datasetInfo`);
        res.status(200).json({
            message: "get data set info success",
        })
        dataSetInfo = call
        console.log(dataSetInfo)
    }catch (error){
        res.status(400).send("Data Set not make");
    }

};
module.exports = {
    getModelInfo,
    getDataSet,
};
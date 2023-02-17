const bigml = require("bigml");
const axios = require("axios");
const jsonfile = require("jsonfile");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const client = new MongoClient(process.env.DB_CONNECT);
const dbName = "Pizza",
    collectionName = "orders";

const connection = new bigml.BigML(process.env.ML_USER , process.env.ML_APIKEY);
const source = new bigml.Source(connection);
let modelInfo = {};
let dataInfo = {};

/**
 * @description Builds data in json file
 */
const makeJsonFile = async (req, res) => {
    try {
        await client.connect();
        const all = await client
            .db(dbName)
            .collection(collectionName)
            .find()
            .limit(1200)
            .toArray();
        client.close();
        const calls = all.map((call) => {
            return {
                order_id: call.order_id,
                branch_id: call.branch_id,
                branch_name: call.branch_name,
                district: call.district,
                order_status: call.order_status,
                order_date: call.order_date,
                order_time: call.order_time,
                order_served_time: call.order_served_time,
                // toppings: call.toppings,
                branch_open: call.branch_open,
                branch_close: call.branch_close,
                topic: call.topic,
            }
        });
        await jsonfile.writeFile("./orderData.json", calls, {spaces: 2});
        res.status(200).json({
            message: "successes make json file"
        })
        // return new Promise((resolve, reject) => {
        //     resolve(true);
        // });
    } catch (error) {
        console.log(error);
    }
};

/**
 * @description Builds a model from the data in the database
 */
const buildModel = async (req, res) => {
    // await makeJsonFile();
    source.create("./orderData.json", function (error, sourceInfo) {
        if (!error && sourceInfo) {
            var dataset = new bigml.Dataset(connection);
            dataset.create(sourceInfo, function (error, datasetInfo) {
                if (!error && datasetInfo) {
                    var model = new bigml.Model(connection);
                    model.create(datasetInfo, function (error, model) {
                        if (!error && model) {
                            console.log(model);
                            res.status(200).json({
                                message: "Model built",
                                modelInfo: model,
                            });
                            modelInfo = model;
                            dataInfo = datasetInfo;
                        } else {
                            res.status(500).send("Error creating model");
                        }
                    });
                } else {
                    res.status(400).send("Error creating dataset");
                }
            });
        } else {
            res.status(400).send("Error creating source");
        }
    });
};

/**
 * @description Association the order using the model
 */
const createAssociation = (req, res) => {
    console.log("modelInfo", modelInfo);
    console.log("createAssociation", req.body);
    const orderToAsso = req.body;
    const association = new bigml.Association(connection);
    association.create(
        dataInfo,
        // { antecedent: "toppings", consequent: "toppings" },
        function (error, associationInfo) {
            if (!error && associationInfo) {
                res.status(200).json({
                    message: "association made",
                    associationInfo: associationInfo,
                });
                console.log(associationInfo);
            } else {
                res.status(500).send("Error making association");
            }
        }
    );
};

/**
 * @description Gets the model info
 */
const getModelInfo = (req, res) => {
    console.log("gettting model info");
    if (modelInfo.resource) {
        res.status(200).json({
            message: "Model info",
            modelInfo: modelInfo,
        });
    } else {
        res.status(400).send("Model not built");
    }
};
const getDataSetlInfo = (req, res) => {
    console.log("gettting data set info");
    if (modelInfo.resource) {
        res.status(200).json({
            message: "DataSet info",
            dataInfo: dataInfo,
        });
    } else {
        res.status(400).send("DataSet not make");
    }
};

module.exports = {
    makeJsonFile,
    buildModel,
    getDataSetlInfo,
    getModelInfo,
    createAssociation
};
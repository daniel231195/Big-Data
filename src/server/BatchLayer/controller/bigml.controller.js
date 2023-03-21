const bigml = require("bigml");
const axios = require("axios");
const jsonfile = require("jsonfile");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const client = new MongoClient(process.env.DB_CONNECT);
const dbName = "test",
    collectionName = "orders";

const connection = new bigml.BigML(process.env.ML_USER, process.env.ML_APIKEY);
const source = new bigml.Source(connection);
let modelInfo = {};
let dataInfo = {};
let associationInfo = {};
/**
 * @description Builds data in json file
 */
// const pizzaTopping = {
//     "עגבניה": "tomato",
//     "אקסטרה גבינה": "extra_cheese",
//     "גבינה כחולה":"blue_cheese",
//     "פפרוני": "pepperoni",
//     "פטריות": "mushrooms",
//     "זיתים שחורים": "black_olives",
//     "פלפל חריף" : "hot_pepper" ,
//     "אננס" : "pineapple",
//     "חלפיניוס" : "chalfinius",
//     "בייקון" : "bacon",
//     "בשר בקר טחון" : "ground_beef" ,
//     "זיתים ירוקים" : "green_olives" ,
//     "תירס" : "corn" ,
//     "בצל" :"onion"  ,
//     "שום" : "garlic",
//     "עוף" : "chicken",
//     "תרד" : "spinach" ,
//     "גבינת פטה" :"feta_cheese" ,
//     "אנשובי" : "anchovy",
//     "לבבות ארטישוק" : "artichoke_hearts",
// };
const pizzaTopping = {
    "עגבניה": "tomato",
    "תירס":"corn",
    "בצל": "onion",
    "פטריות": "mushrooms",
    "זיתים": "olives",
};

const makeCSVFile = async (req, res) => {
    try {
        await client.connect();
        const all = await client
            .db(dbName)
            .collection(collectionName)
            .find()
            .limit(1000)
            .toArray();
        client.close();
        let toping = all?.map((all)=> all.toppings)
        let arr = toping?.map((x) => x?.map((i) => pizzaTopping[i.split("").reverse().join("")]));
        let data = ""
        arr?.forEach((i) => (data += i.join(",") + "\n"))
        toping?.forEach((i) => (data += i.join(",") + "\n"))
        const fs = require('fs');
        try {
            // fs.writeFileSync('orderData.csv',data);
            // console.log('CSV file has been created successfully.');
            return new Promise((resolve, reject) => {
                resolve(true);
                res.status(200).json({
                    message: "successes make CSV file"
                })
            });
        }
        catch (err) {
            console.error(err);
        }

    } catch (error) {
        console.log(error);
     }
};

/**
 * @description Builds a model from the data in the database
 */
const buildModel = async (req, res) => {
    try {
        await makeCSVFile();
    } catch (err) {
        console.log("cannot make csv file ")
        console.log(err);
    }
    source.create("./orderData.csv", function (error, sourceInfo) {
        if (!error && sourceInfo) {
            var dataset = new bigml.Dataset(connection);
            dataset.create(sourceInfo, function (error, datasetInfo) {
                if (!error && datasetInfo) {
                    var model = new bigml.Model(connection);
                    model.create(datasetInfo, function (error, model) {
                        if (!error && model) {
                            res.status(200).json({
                                message: "Model built successes",
                                modelInfo: model,
                            });
                            console.log("Model built successes")
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
const createAssociation = async (req, res) => {
    const association = new bigml.Association(connection);
    association.create(
        dataInfo,
        // { antecedent: "toppings", consequent: "toppings" },
        function (error, associationInfo) {
            if (!error && associationInfo) {
                console.log("associationInfo.resource : " , associationInfo.resource)
                getAssociationRules(associationInfo.resource, res);
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
    console.log("getting model info");
    if (modelInfo.resource) {
        res.status(200).json({
            message: "Model info",
            modelInfo: modelInfo,
        });
    } else {
        res.status(400).send("Model not built");
    }
};
const moreRules = (rules, items) => {
    const sets = [];
    for (const rule of rules) {
        const antecedents = rule.lhs.map((item) => items[item].name).join(", ");
        const consequents = rule.rhs.map((item) => items[item].name).join(", ");
        const support = `${rule.support[0] * 100}%`;
        const confidence = `${rule.confidence * 100}%`;
        const count = rule.support[1];
        sets.push({ antecedents, consequents, support, confidence, count });
    }
    return sets;
};
// const moreRules = (rules, items) => {
//     const sets = [];
//     for (let i = 0; i < rules.length; ++i) {
//         const antecedent = rules[i].lhs;
//         const consequent = rules[i].rhs;
//         let antecedents = "";
//         let consequents = "";
//
//         for (let i = 0; i < antecedent.length; ++i) {
//             antecedents += items[antecedent[i]].name;
//             if (i < antecedent.length - 1) antecedents += ", ";
//         }
//         for (let i = 0; i < consequent.length; ++i) {
//             consequents += items[consequent[i]].name;
//             if (i < consequent.length - 1) consequents += ", ";
//         }
//         const support = rules[i].support[0] * 100 + "%";
//         const confidence = rules[i].confidence * 100 + "%";
//         const count = rules[i].support[1];
//         sets.push({
//             antecedent: antecedents,
//             consequent: consequents,
//             support: support,
//             confidence: confidence,
//             count: count,
//         });
//     }
//     return sets;
// };

module.exports = {
    makeCSVFile,
    buildModel,
    createAssociation,
};
const axios = require("axios");
const jsonfile = require("jsonfile");


/**
 * @description Gets the model info
 */
const getAssociation = async (req, res) => {
    console.log("getting Association.......");
    try{
        const call = await axios.get(`http://localhost:3003/api/buildModel`);
        const ans = await axios.post(`http://localhost:3003/api/associationOrder`)
        console.log("getting SUCCESSES.......")
        res.status(200).json(ans.data);
        console.log("end getting Association")
    }catch (error){
        res.status(400).send("Association filed");
    }

};

module.exports = {
    getAssociation,
};
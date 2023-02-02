const { MongoClient, Timestamp } = require('mongodb');
const  pizzaInformation  = require("./PizzaInformation.js");

const pizzaBranches = pizzaInformation.pizzaBranches;
const pizzaToppings = pizzaInformation.pizzaTopping;

const url = 'mongodb+srv://yosimami50:1324qewr@kafkasource.madoaam.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(url);

const orderInterval = 5000;

let orderCount = 1;


function addToping() {
    let topping = []
    let toppingAmmount = Math.floor(Math.random() * 5); // 0-4 topping for each pizza
    for (let index = 0; index < toppingAmmount; index++) {
        let randomIndexToppings = Math.floor(Math.random() * pizzaToppings.length);
        topping.push(pizzaToppings[randomIndexToppings]);
    }
    return topping;
}

function genrateOrder() {
    let randomIndexBranches = Math.floor(Math.random() * pizzaBranches.length);
    return {
      order_id: orderCount,
      branch_id: pizzaBranches[randomIndexBranches].branch_id,
      branch_name: pizzaBranches[randomIndexBranches].branch_name,
      district: pizzaBranches[randomIndexBranches].district,
      order_status: "pending",
      order_date: new Date().getDate(),
      order_time: new Date().getHours() + ":" + new Date().getMinutes(),
      topping: addToping()
    };
  }
  
  client.connect(function(err) {
    if (err) {
      console.log("Error connecting to MongoDB: ", err);
      return;
    }
  
    const db = client.db("PizzaOrders");
    const collection = db.collection("Orders");
  
    setInterval(function() {
      let order = genrateOrder();
      orderCount++;
  
      collection.insertOne(order, function(err, result) {
        if (err) {
          console.log("Error inserting order: ", err);
          return;
        }
  
        console.log("Inserted order: ", order);
      });
    }, orderInterval);
  });


let mongoose = require('mongoose');

const server = 'yosimami50:1324qewr@kafkamongosink.inyklxk.mongodb.net/Pizza?retryWrites=true&w=majority&wtimeoutMS=5000"'; 
const database = 'PizzaOrders';      

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb+srv://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
require('./mongoDB/Order');

module.exports = new Database()
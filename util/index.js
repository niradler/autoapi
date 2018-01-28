const Knex = require('knex');
const env =require('dotenv').config();
const connection ={
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    typeCast: function(field, next) {
      if (field.type == 'TINY' && field.length == 1) {
          return (field.string() == '1'); // 1 = true, 0 = false
      }else if(field.type == 'BIT' && field.length == 1){
          return (field.string() == "\u0001"); // 1 = true, 0 = false  
      }
      return next();
  }
  }
class DB {
    constructor(connection){
        this.knex = Knex({
            client: 'mysql',
            connection: connection
          });
          
    }

}
const db = new DB(connection);
exports.knex = db.knex;

const knex = require('../../util').knex
const env =require('dotenv').config();
 const post = async (table,body)=>{
    try {
    let response = [];
        if (index) {
           const r = knex(table).insert(body)
            response=r;
        }
        return response;  
    } catch (error) {
        console.log(error)
        return error;
    }

    
}
module.exports =post;
const knex = require('../../util').knex
const env =require('dotenv').config();
 const del = async (table,index)=>{
    try {
    const _index=process.env.INDEX,_limit = process.env.LIMIT ?process.env.LIMIT:1000;
    let response = [];
    
        if (index) {
            response = await knex(table).where({[_index]:index}).del()
        }else{
            response = 'missing index!'
        }
        return response;  
    } catch (error) {
        console.log(error)
        return error;
    }

    
}
module.exports =del;
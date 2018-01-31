const knex = require('../../util').knex
const env =require('dotenv').config();
 const get = async (table,index,filter)=>{
    try {
    const _index=process.env.INDEX,_limit = process.env.LIMIT ?process.env.LIMIT:1000;
    let response = [];
    
        if (index) {
            response = await knex(table).where({[_index]:index}).select('*')
        }else{
            if (filter) {
                response = await knex(table).whereRaw(`${filter.field} ${filter.operator} '${filter.value}'`,[]).select('*').limit(_limit)
            } else {
                response = await knex(table).select('*').limit(_limit)
            }
        }
        return response;  
    } catch (error) {
        console.log(error)
        return error;
    }

    
}
module.exports =get;
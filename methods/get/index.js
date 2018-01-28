const knex = require('../../util').knex
const env =require('dotenv').config();
exports = async (table,index,filter)=>{
    try {
    console.log('knex',knex);
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
    } catch (error) {
        console.log(error)
        response = error;
    }

    return response;
}
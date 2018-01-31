const knex = require('../../util').knex
const env =require('dotenv').config();
 const put = async (table,body,index)=>{
    try {
    const _index=process.env.INDEX,_limit = process.env.LIMIT ?process.env.LIMIT:1000;
    let response = [];
        if (index) {
           const r = await knex(table)
            .where({
                [_index]: index
            })
            .update(body)
            response=r;

        }else{
            response = 'missing index!'
        }
        return response;  
    } catch (error) {
        console.log(error)
        return error;
    }

    
}
module.exports =put;
const express = require('express')
const app = express()
const knex = require('./util').knex
const bodyParser = require('body-parser')
const env =require('dotenv').config();
const _get = require('./methods/get')

app.use(bodyParser.json())

const handle = async (req, res) => {
    let filter=null;
    const table = req.params.table,_index=process.env.INDEX;
    try {
        const raw_tables = await(knex.raw(`SELECT tables.TABLE_NAME
        FROM INFORMATION_SCHEMA.tables as tables
        where tables.TABLE_SCHEMA = '${process.env.DB_NAME}'
        order by tables.TABLE_NAME;`))
        const tables = raw_tables[0].map((t)=>{
            return t.TABLE_NAME
        })
        //console.log(tables,table)
        if (tables.indexOf(table)==-1) {
            return res.json({err:"table not exist!"})
        }
        if(req.query.filter){
            filter = JSON.parse(req.query.filter) 
        }
        switch (req.method) {
            case 'GET':
            var r = await _get(table,req.params.index,filter);
            let response=[]
            res.json(response.length==0 ? []:response[0]);
                break;
                case 'PUT':
                knex(table)
                .where({
                    [_index]: req.params.index
                })
                .update(req.body).then((r) => {
                    return res.json(r)
                }).catch((e) => {
                    return res.json(e)
                })
                break;
                case 'POST':
                knex(table).insert(req.body).then((r) => {
                    return res.json(r);
                }).catch((e) => {
                    return res.json(e);
                })
                break;
            default:
            return res.json({errors:"unknown method!"});
                break;
        }
       
    } catch (err) {
        console.log('lib failed!',err)
        return res.json({errors:err.message});
    }

}
app.all('/:table/:index', handle)
app.all('/:table', handle)
app.get('/', (req,res)=>{
    return res.send('auto api!')
    })
app.listen(3000, () => console.log('Example app listening on port 3000!'))
const express = require('express')
const app = express()
const Knex = require('knex')
const bodyParser = require('body-parser')
const env =require('dotenv').config();
// parse application/json
app.use(bodyParser.json())
/*
SELECT tables.TABLE_NAME
-- ,cols.COLUMN_NAME
FROM INFORMATION_SCHEMA.tables as tables
-- left join INFORMATION_SCHEMA.COLUMNS as cols on cols.TABLE_SCHEMA = tables.TABLE_SCHEMA
where tables.TABLE_SCHEMA = 'shelfmintdev2'
order by tables.TABLE_NAME;
*/
const knex = Knex({
    client: 'mysql',
    connection: {
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
  });

const handle = async (req, res) => {
    let filter;
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
            if (req.params.index) {
                knex(table).where({[_index]:req.params.index}).select('*').then((r) => {
                    console.log(r)
                    return res.json(r.length==0 ? []:r[0]);
                }).catch((err)=>{
                    return res.json({errors:err});
                }) 
            }else{
                if (filter) {
                    knex(table).whereRaw(`${filter.field} ${filter.operator} '${filter.value}'`,[]).select('*').limit(1000).then((r) => {
                        return res.json(r);
                    }).catch((err)=>{
                        return res.json({errors:err});
                    }) 
                } else {
                    knex(table).select('*').limit(1000).then((r) => {
                        return res.json(r);
                    }).catch((err)=>{
                        return res.json({errors:err});
                    }) 
                }
              
            }
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
        return res.json({errors:err});
    }

}
app.all('/:table/:index', handle)
app.all('/:table', handle)
app.get('/', (req,res)=>{
    return res.send('auto api!')
    })
app.listen(3000, () => console.log('Example app listening on port 3000!'))
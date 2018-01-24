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
    var u = req.path.split('/').splice(1);
   console.log(u)
    switch (req.method) {
        case "POST":
            
            break;
            case "GET":
            var r = await knex.select('*').from(u[0]).limit(100)
            break;
        default:
            break;
    }
return res.json(r)
}

app.use('/:table', handle)
app.get('/', (req,res)=>{
    return res.send('auto api!')
    })
app.listen(3000, () => console.log('Example app listening on port 3000!'))
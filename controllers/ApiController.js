const knex = require('../util').knex
const methods = require('../methods')
module.exports = async (req, res)=>{
    let filter = null;
    const table = req.params.table,
        _index = process.env.INDEX;
    try {
        const raw_tables = await(knex.raw(`SELECT tables.TABLE_NAME
        FROM INFORMATION_SCHEMA.tables as tables
        where tables.TABLE_SCHEMA = '${process.env.DB_NAME}'
        order by tables.TABLE_NAME;`))
        const tables = raw_tables[0].map((t) => {
            return t.TABLE_NAME
        })
        //console.log(tables,table)
        if (tables.indexOf(table) == -1) {
            return res.json({err: "table not exist!"})
        }
        if (req.query.filter) {
            filter = JSON.parse(req.query.filter)
        }
        let response={};
        switch (req.method) {
            case 'GET':
                 response = await methods.get(table, req.params.index, filter);
                res.json(response.length==0 ? []:response[0]);
                break;
            case 'PUT':
                 response = await methods.put(table, req.body, req.params.index);
                res.json(response.length==0 ? []:response);
                break;
            case 'POST':
                 response = await methods.post(table, req.body);
                res.json(response.length==0 ? []:response);
                break;
                case 'DELETE':
                 response = await methods.delete(table, req.body,req.params.index);
                res.json(response.length==0 ? []:response);
                break;
            default:
                return res.json({errors: "unknown method!"});
                break;
        }

    } catch (err) {
        console.log('lib failed!', err)
        return res.json({errors: err.message});
    }

}
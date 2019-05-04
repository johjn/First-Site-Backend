const koa = require("koa");
var cors = require('kcors');
const logger = require('koa-logger')
const app = new koa();
var pg = require('pg');
var format = require('pg-format');
var PGUSER = 'postgres';
var PGDATABASE = 'inform';



const koabody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const router = require('./router');

var db;
app.use(cors());
app.use(koabody());
app.use(logger())
app.use(router.routes());
app.use(router.allowedMethods());
app.use(bodyParser());

var config = {
    user: PGUSER, // name of the user account
    database: PGDATABASE, // name of the database
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
  }
  
  var pool = new pg.Pool(config)
              
  // GET (select all from database)
router.get('/info', async(ctx) =>{
   try {
     const result = await pool.query('select * from "angajati" order by lastname');
     ctx.body = result.rows;
   } catch(err) {
     ctx.status = err.status || 500;
     ctx.body = err.message;
   }
}) 

// GET (select all from database with id)
router.get('/info/:id', async(ctx) =>{
   try {
     const result = await pool.query(`select * from "angajati" where id_angajati = ${ctx.params.id}`)
     ctx.body = result.rows
   } catch(err) {
     ctx.status = err.status || 500;
     ctx.body = err.message;
   }
}) 

// POST (insert date in database)
router.post('/insert', async(ctx) =>{
  console.log(ctx.request.body.lsname)
  try {
    const result = await pool.query(`insert into "angajati" (name,lastname,salary)
                                                   values ('${ctx.request.body.name}',
                                                           '${ctx.request.body.lsname}',
                                                            ${ctx.request.body.sal})`)
                                            
    ctx.body = result.rows
  } catch(err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
}) 

// PUT (update date in database)
router.put('/update/:id', async(ctx) =>{
   try {
     const result = await pool.query(`update "angajati" set name = '${ctx.request.body.name}',
                                                        lastname = '${ctx.request.body.lsname}',
                                                          salary =  ${ctx.request.body.sal}
                                              where id_angajati =  ${ctx.params.id}`)
     ctx.body = result.rows
   } catch(err) {
     ctx.status = err.status || 500;
     ctx.body = err.message;
   }
}) 

//DELETE (delete date from database with id)
router.delete('/delete/:id', async(ctx) =>{
  try {
    const result = await pool.query(`delete from "angajati" where id_angajati = ${ctx.params.id}`)
    ctx.body = result.rows
  } catch(err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
}) 

//Conection databasse
pool.connect(function (err) {
    if (err) console.log(err)
    app.listen(3000, function () {
    console.log('listening on 3000')
    })
})
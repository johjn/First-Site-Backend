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
              
  // GET
router.get('/info', async(ctx) =>{
   await pool.connect()
  .then(()=>pool.query('select * from "angajati"'))
  .then(results => ctx.body = results.rows)
  .catch(e => ctx.body =e)

}) 

router.get('/info/:id', async(ctx) =>{
  await pool.connect()
 .then(()=>pool.query(`select * from "angajati" where id_angajati = ${ctx.params.id}`))
 .then(results => ctx.body = results.rows)
 .catch(e => ctx.body =e)

}) 

router.delete('/delete/:id', async(ctx) =>{
  console.log(ctx)
  /*await pool.connect()
 .then(()=>pool.query('delete from "angajati" where id_angajati ="1"'))
 .then(results => ctx.body = results.rows)
 .catch(e => ctx.body =e)*/

}) 

   pool.connect(function (err) {
    if (err) console.log(err)
    app.listen(3000, function () {
      console.log('listening on 3000')
    })})
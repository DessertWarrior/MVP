const dotenv = require('dotenv');
const {Pool} = require('pg');
const express = require('express');
const app = express();
dotenv.config();
console.log(process.env.DATABASE_URL);
const port = process.env.PORT || 3000;
const pg = new Pool({connectionString: process.env.DATABASE_URL});
pg.connect();

app.use(express());
app.use(require('body-parser').urlencoded( {extended: false}))
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.send('hi');
})
app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})
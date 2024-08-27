const express = require('express');
require('dotenv').config()
const app = express();
const customer_router = require('./routes/customer_routes')
const cors = require('cors')
PORT = process.env.PORT
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(('/customer/api'),customer_router)



app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})
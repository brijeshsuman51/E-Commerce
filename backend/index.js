const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/mongoDB')
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userRoute');
const cors = require('cors');
const redisClient = require('./config/redisDB');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))

app.use(express.json())
app.use(cookieParser())

app.use('/user',authRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/order',orderRouter)

const InitializeConnection = async () => {
    try {
        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected")

        app.listen(process.env.PORT,()=>{
            console.log("Server is running at Port Number:"+process.env.PORT)
        })
    } catch (error) {
        console.error("Error:",error.message)
    }
}

InitializeConnection()
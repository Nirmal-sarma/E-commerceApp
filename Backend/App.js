const express=require("express");

const app=express();
const cookiePaser=require('cookie-parser');


app.use(express.json());
app.use(cookiePaser())
const product=require("./routes/productRoutes");
const Error=require('./middleware/Error');
const user=require('./routes/UserRoute');
const Order=require('./routes/OrderRouter');

app.use("/api/v1", product);
app.use("/api/v1",user);
app.use("/api/v1",Order);


//Middleware for Error
app.use(Error);

module.exports=app;
const app=require('./App.js');
const dotenv=require('dotenv');
const connectDatabase=require('./Config/Database');

dotenv.config({path:"Backend/Config/config.env"});

connectDatabase();
//handling Uncaught Exception.

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception`);
    process.exit(1);
})


app.listen(process.env.PORT,()=>{
    console.log(`Server is Ready on port ${process.env.PORT}`)
});

//unhandled Promise error
process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log("shutting down the server due to Unhandled Promise rejection");

    server.close(()=>{
        process.exit(1);
    })
})


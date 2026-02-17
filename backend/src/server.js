import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import connectDB from './libs/db.js';
dotenv.config();
const app=express();
const __dirname=path.resolve();

app.use(express.json()); // Middleware to parse JSON bodies in requests

//Authentication routes
app.use('/api/auth',authRoutes);
//Message routes
app.use('/api/messages',messageRoutes);
if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname,'../frontend/dist')));
    app.get('*',(_,res)=>
    {
        res.sendFile(path.join(__dirname,'../frontend/dist/index.html'));
    });
}
const PORT=process.env.PORT || 3000;


app.listen(PORT,()=>
{
    console.log("Server is running on port: "+PORT);
    connectDB();
})
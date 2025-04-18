import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";   
import 'dotenv/config';
import connectdb from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';

const app= express();
const port = process.env.PORT || 3000;

connectdb

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.get('/', (req, res) => {
    res.send("API is working perfectly");
  });

app.use('/api/auth',authRouter);
app.listen(port,()=> console.log(`server started on port:${port}`));

//this is my checking comment ...please no worry!!!S
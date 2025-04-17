import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";   
import 'dotenv/config';

const app= express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

app.get('/', (req, res) => {
    res.send("API is working perfectly");
  });
app.listen(port,()=> console.log(`server started on port:${port}`));

//this is my checking comment ...please no worry!!
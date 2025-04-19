import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usermodel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';

export const register =async (req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.json({success:false,message:'missing details'});
    }
    try{
        const existinguser= await usermodel.findOne({email});
        if(existinguser){
            return res.json({success:false,message:"user already exists"});
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const user=new usermodel({name,email,password:hashedpassword});
        await user.save();

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token ,{
            httpOnly:true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none':'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome email
        const mailoptions = {
            from : process.env.SENDER_EMAIL,
            to : email, 
            subject : 'welcome',
            text : `Your account has been created with email id :${email}` 
        }

        await transporter.sendMail(mailoptions);

        return res.json({success:true});


    }catch(error){
        res.json({success:false,message:error.message});
    }
}



export const login = async (req,res)=> {
    const{email, password}= req.body;

    if(!email || !password){
        return res.json({success:false, message: "email and password are required"});
    }
    try{
        const user = await usermodel.findOne({email});

        if(!user){
            return res.json({success:false,message:"Invalid Email"});
        }

        const Ismatch = await bcrypt.compare(password,user.password);

        if(!Ismatch){
            return res.json({success:false,message:"Invalid password"});
        }
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token',token ,{
            httpOnly:true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none':'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true});



    }catch(error){
        return res.json({success:false, message: error.message});
    }
}
export const logout = async(req,res)=> {
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none':'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true, message :"logged out"});

    }catch(error){
        return res.json({success:false, message: error.message});
    }
}
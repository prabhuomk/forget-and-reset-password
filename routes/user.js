import {  insertUser,getUser,updateUser,inserttoken,gettoken,deletetoken} from "../helper.js";

import {createConnection} from "../index.js";
import express  from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import {sendEmail} from "../middleware/mail.js"

const router=express.Router();




router
.route("/signup")
.post(async (request,response)=>{
    const { email_id,firstname,lastname,password }= request.body;
    
    

    const client=await createConnection();
    const hashedPassword=await genPassword(password);

    const pass=await insertUser(client,{email_id:email_id,firstname:firstname,lastname:lastname,password:hashedPassword})
    console.log(hashedPassword,pass );
    response.send(pass);
    
});

router
.route("/login")
.post(async (request,response)=>{
    const { email_id,password }= request.body;
    const client=await createConnection();
    const user=await getUser(client,{email_id:email_id});
    if(!user){
        response.send({message:"user not exist ,please sign up"})
    }else{
    console.log(user._id);
    
    const inDbStoredPassword=user.password;
    const isMatch= await bcrypt.compare(password,inDbStoredPassword);
    if(isMatch){
        const token=jwt.sign({id:user._id},process.env.KEY)
    
        response.send({message:"successfully login",token:token,email_id:email_id});
    }
    else{
        response.send({message:"invalid login"});

    } 
} 
    
});

router
.route("/forgetpassword")
.post(async (request,response)=>{
    const { email_id }= request.body;
    const client=await createConnection();
    const user=await getUser(client,{email_id});
    if(!user){
        response.send({message:"user not exist"})
    }else{

        const token=jwt.sign({id:user._id},process.env.REKEY);
        const store= await inserttoken(client,{tokenid:user._id,token:token});
        const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
       
      const mail=  await sendEmail(user.email_id, "Password reset", link);
    response.send({message:"link has been send to your email for password change"});

    } 
} 
    
);

router
.route("/resetpassword/:id/:token")
.post(async (request,response)=>{
    const { password }= request.body;
    const id=request.params.id;
    const token=request.params.token;
    const client=await createConnection();
    const tokens=await gettoken(client,{token:token});
    if(!tokens){
        response.send({message:"invalid token"})
    }else{
        const hashedPassword=await genPassword(password);
        const updateuserpassword = await updateUser(client,id,hashedPassword);
        const deletetokens= await deletetoken(client,id);
        response.send({message:"password updated and token got deleted"})

    } 
} 
    
);



async function genPassword(password){
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}




export const userRouter=router;

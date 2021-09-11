import mongodb from "mongodb";




export async function insertUser(client, user) {
    const result = await client.db("password").collection("user").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}




export async function getUser(client, filter) {
    const result = await client.db("password").collection("user").findOne(filter);
    console.log("successfully matched", result);
    return result;
}

export async function updateUser(client, _id,password) {
    const result = await client.db("password").collection("user").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:{password:password}});
    console.log("successfully new password updated", result);
    return result;
}

export async function inserttoken(client, user) {
    const result = await client.db("password").collection("tokens").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function gettoken(client, filter) {
    const result = await client.db("password").collection("tokens").findOne(filter);
    console.log("successfully matched", result);
    return result;
}


export async function deletetoken(client,tokenid){
    const deletetokens= await client.db("password").collection("tokens").deleteOne({tokenid:new mongodb.ObjectId(tokenid)});
    console.log("successfully token is deleted",deletetokens);
    return deletetokens;
}







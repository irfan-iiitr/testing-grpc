const grpc=require('@grpc/grpc-js');
const protoLoader=require("@grpc/proto-loader");

const express = require('express');
const bodyParser = require('body-parser');      // To parse JSON requests
const path = require('path');

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// Load Proto

const packageDef=protoLoader.loadSync(path.join(__dirname,'./protos/user.proto'));
const userProto=grpc.loadPackageDefinition(packageDef).user;

//grpc-method

function GetUser(call,callback){
    const userId=call.request.id;
    const user=users.find(user=>user.id==userId);


    console.log("req: ",call.request);

    if(user)
        callback(null,user); 
    else
        callback({code:grpc.status.NOT_FOUND,message:"user not found"});
}

function startGrpcServer(){
    const server=new grpc.Server();
    server.addService(userProto.UserService.service,{GetUser});

    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),()=>{
        console.log('User Service grpc running at http://0.0.0.0:50051');
        //server.start();
    })
}


function startRestService(){
    const app=express();
    app.use(bodyParser.json());

    app.get('/users/:id',(req,res)=>{
        const user=users.find(user=>user.id===parseInt(req.params.id));
        if(user)
            res.json(user);
        else
            res.status(404).json({error:"user not found"});
    })

    app.listen(3000,()=>{
        console.log('User Service REST running  at http://localhost:3000')
    })
}

startGrpcServer();
startRestService();
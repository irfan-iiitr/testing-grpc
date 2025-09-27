const fs=require('fs');
const path=require('path')
const protobuf=require('protobufjs');

const users=[];
for(let i=1;i<=1000;i++){
    users.push({id:i,name:`User ${i}` , email: `user${i}@example.com`});
}

// Save in JSON

const jsonPath=path.join(__dirname,'data/users.json');
fs.writeFileSync(jsonPath,JSON.stringify(users));
console.log('JSON file saved at',jsonPath);

const saveProtoBufFile=async()=>{
   const root=await protobuf.load(path.join(__dirname,'protos/user.proto'));
   const userList=root.lookupType('demo.UserList');

   // Verify the data matches schema
   const message =userList.create({users});
   const buffer=userList.encode(message).finish();


   const pbPath=path.join(__dirname,'data/users.pb');
   fs.writeFileSync(pbPath,buffer);
   console.log("Protobuf file saved at",pbPath);
}

async function run() {
  await saveProtoBufFile();
}

// Call the named function
run();
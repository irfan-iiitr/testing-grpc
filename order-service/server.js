// Load modules
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// --- Load Proto Files ---
const orderPackageDef = protoLoader.loadSync(path.join(__dirname, './protos/order.proto'));
const orderProto = grpc.loadPackageDefinition(orderPackageDef).order;

const userPackageDef = protoLoader.loadSync(path.join(__dirname, '../user-service/protos/user.proto'));
const userProto = grpc.loadPackageDefinition(userPackageDef).user;

// --- UserService gRPC Client ---
const userClient = new userProto.UserService('localhost:50051', grpc.credentials.createInsecure());

// --- gRPC Method ---
function CreateOrder(call, callback) {
  const { userId, product } = call.request;

  console.log("req: ",call.request);

  // Call UserService to get user info
  userClient.GetUser({ id: userId }, (err, user) => {
    if (err) callback(null, { status: 'FAILED', message: 'User not found' });
    else callback(null, { status: 'SUCCESS', message: `Order for ${product} created for ${user.name}` });
  });
}

// --- Start gRPC Server ---
function startGrpcServer() {
  const server = new grpc.Server();
  server.addService(orderProto.OrderService.service, { CreateOrder });

  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    console.log('OrderService gRPC running at http://0.0.0.0:50052');
    server.start();
  });
}

// --- REST API ---
function startRestServer() {
  const app = express();
  app.use(bodyParser.json());

  app.post('/orders', (req, res) => {
    const { userId, product } = req.body;

    // Call UserService to get user info
    userClient.GetUser({ id: userId }, (err, user) => {
      if (err) res.status(404).json({ status: 'FAILED', message: 'User not found' });
      else res.json({ status: 'SUCCESS', message: `Order for ${product} created for ${user.name}` });
    });
  });

  app.listen(4000, () => console.log('OrderService REST running at http://localhost:4000'));
}

// --- Start Both Servers ---
startGrpcServer();
startRestServer();

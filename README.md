# react-go-grpc

## Motive
This project is a part of the learning process. The main focus here was:-<br/>
  -Creating appropriate .proto files<br/>
  -Defining services and methods<br/>
  -Calling the services on grpc server and grpc client<br/>
  -Creating stubs for client-server interaction<br/>
 A simple implementation of gRPC architecture with Go and React.

## Function
The web app has two pages on the front end:-<br/>
  -One is for listing the existing restaurants from a mySQL database in the form of cards.<br/>
  -Another page consists of a form for adding a new restaurant into the database.</br>
 
## Workflow
### Listing the existing restaurants
  -To get the restaurant list, the React front end server makes an http GET request to the grpcClient.go (golang http server).<br/>
  -This grpcClient.go then makes a gRPC request to the grpcServer.go (golang gRPC server)<br/>
  -This grpcServer.go makes the call to the mySQL database and sends the restaurant list as a response to the grpcClient.go server.<br/>
  -grpcClient.go sends the restaurant list to the react front end and the list is rendered.<br/>
  
### Adding a new restaurant
  -To add a new restaurant, the React front end server makes an http POST request to the grpcClient.go (golang http server).<br/>
  -This grpcClient.go then makes a gRPC request to the grpcServer.go (golang gRPC server)<br/>
  -This grpcServer.go makes the call to the mySQL database and saves the new restaurant. It sends back the confirmation the grpcClient.go server.<br/>
  -grpcClient.go sends the confirmation to the react front end server and the client is redirected to the homepage.<br/>


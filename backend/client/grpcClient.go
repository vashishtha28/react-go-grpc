package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	pb "github.com/vashishtha28/backend/miniZomato"
	"google.golang.org/grpc"
)

var (
	serverAddr = flag.String("sever_addr", "localhost:10000", "The server address in the format of host:port")
)

type Restaurant struct {
	Name        string `json:"name"`
	Rating      string `json:"rating"`
	Cuisine     string `json:"cuisine"`
	Address     string `json:"address"`
	OpeningTime string `json:"openingTime"`
	CostForTwo  string `json:"costForTwo"`
}

func setupCorsResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization")
}

func homepage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to home page !!!")
	fmt.Println("Endpoint hit: homepage")
}

func findRestaurants(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint hit: returnRestaurants")
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	//headers
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	//establish connection with grpc server
	conn, err := grpc.Dial(*serverAddr, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("failed to dial: %v", err)
	}
	defer conn.Close()
	client := pb.NewAddGetRestaurantClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	//call for List restaurant service
	result, err := client.ListRestaurants(ctx, &pb.GetListRequest{GetListRequest: "GET"})
	if err != nil {
		log.Fatalf("Coud not get restaurants list: %v", err)
	}
	//the variable to store unmarshalled json
	var receivedList []Restaurant
	json.Unmarshal([]byte(result.RestaurantList), &receivedList)
	//send response to frontend server
	w.Write([]byte(result.RestaurantList))

}

func addRestaurant(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Endpoint hit: returnRestaurants")
	setupCorsResponse(&w, r)
	if (*r).Method == "OPTIONS" {
		return
	}

	// fmt.Println("Endpoint hit: addRestaurant")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	//establishh connection with grpc server
	conn, err := grpc.Dial(*serverAddr, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("failed to dial: %v", err)
	}
	defer conn.Close()
	client := pb.NewAddGetRestaurantClient(conn)

	//Retrieve data from request amd store it in a variable
	var res Restaurant
	s, _ := io.ReadAll(r.Body)
	json.Unmarshal([]byte(s), &res)

	//contact the server and print out its response
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	//call out service to add restaurant
	result, err := client.AddRestaurant(ctx, &pb.Restaurant{
		Name:        res.Name,
		Rating:      res.Rating,
		Cuisine:     res.Cuisine,
		Address:     res.Address,
		OpeningTime: res.OpeningTime,
		CostForTwo:  res.CostForTwo,
	})
	if err != nil {
		log.Fatalf("could not add restaurant: %v", err)
	}

	//write result and send confirmation to frontend
	fmt.Printf(result.AddedConfirmation)
}

func handleRequests() {
	//create a new instance of a mux router
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homepage)
	myRouter.HandleFunc("/restaurants", findRestaurants)
	myRouter.HandleFunc("/add", addRestaurant)
	http.ListenAndServe(":5000", myRouter)

}

func main() {
	log.Println("grpc client listening on port 5000")
	flag.Parse()
	handleRequests()

}

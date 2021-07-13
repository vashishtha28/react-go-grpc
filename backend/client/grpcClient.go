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
	Name             string `json:"name"`
	Rating           string `json:"rating"`
	Cuisine          string `json:"cuisine"`
	Address          string `json:"address"`
	OpeningTime      string `json:"openingTime"`
	CostForTwo       string `json:"costForTwo"`
	NameAddressToken string `json:"nameAddressToken"`
}

type Token struct {
	Token string `json:"token"`
}

type PaginationInfo struct {
	CurrentPage  string `json:"currentPage"`
	PostsPerPage string `json:"postsPerPage"`
}

type TotalPostsInfo struct {
	TotalPosts string `json:"totalPosts"`
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

func checkUniqueness(w http.ResponseWriter, r *http.Request) {
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

	//retrieve token from request
	var token Token
	t, _ := io.ReadAll(r.Body)
	json.Unmarshal([]byte(t), &token)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	//call out service to check uniqueness
	result, err := client.NoRepeatValidation(ctx, &pb.NameAddressToken{
		NameAddressToken: token.Token,
	})
	if err != nil {
		log.Fatalf("Failed to get uniqueness status: %v", err)
	}

	//the variable to store unmarshalled json
	var received Token
	json.Unmarshal([]byte(result.Uniqueness), &received)
	//send response to frontend server
	w.Write([]byte(result.Uniqueness))

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

	//Retrieve data from request amd store it in a variable
	var req PaginationInfo
	s, _ := io.ReadAll(r.Body)
	json.Unmarshal([]byte(s), &req)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	//call for List restaurant service
	result, err := client.ListRestaurants(ctx, &pb.GetListRequest{CurrentPage: req.CurrentPage, PostsPerPage: req.PostsPerPage})
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
		Name:             res.Name,
		Rating:           res.Rating,
		Cuisine:          res.Cuisine,
		Address:          res.Address,
		OpeningTime:      res.OpeningTime,
		CostForTwo:       res.CostForTwo,
		NameAddressToken: res.NameAddressToken,
	})
	if err != nil {
		log.Fatalf("could not add restaurant: %v", err)
	}

	//write result and send confirmation to frontend
	fmt.Printf(result.AddedConfirmation)
}

func handleTotalPosts(w http.ResponseWriter, r *http.Request) {
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

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	//call out service to get total posts
	result, err := client.GetTotalPosts(ctx, &pb.TotalPosts{
		TotalPosts: "1",
	})

	if err != nil {
		log.Fatalf("could not find total posts: %v", err)
	}
	//the variable to store unmarshalled json
	var toSend TotalPostsInfo
	log.Println(result.TotalPosts)

	json.Unmarshal([]byte(result.TotalPosts), &toSend)
	//send response to frontend server
	w.Write([]byte(result.TotalPosts))

}

func handleRequests() {
	//create a new instance of a mux router
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homepage)
	myRouter.HandleFunc("/restaurants", findRestaurants)
	myRouter.HandleFunc("/add", addRestaurant)
	myRouter.HandleFunc("/check/uniqueness", checkUniqueness)
	myRouter.HandleFunc("/totalposts", handleTotalPosts)
	http.ListenAndServe(":5000", myRouter)

}

func main() {
	log.Println("grpc client listening on port 5000")
	flag.Parse()
	handleRequests()

}

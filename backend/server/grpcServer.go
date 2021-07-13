package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"strconv"

	"github.com/jinzhu/gorm"
	pb "github.com/vashishtha28/backend/miniZomato"
	"google.golang.org/grpc"

	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
)

var (
	port = flag.Int("port", 10000, "The gRPC server port")
)

//declare db, err globally
var db *gorm.DB
var err error

type Restaurant struct {
	Name             string `json:"name"`
	Rating           string `json:"rating"`
	Cuisine          string `json:"cuisine"`
	Address          string `json:"address"`
	OpeningTime      string `json:"openingTime"`
	CostForTwo       string `json:"costForTwo"`
	NameAddressToken string `json:"nameAddressToken"`
}

type TotalPostsResponse struct {
	TotalPages int32 `json:"totalPages"`
}

type grpcServer struct {
	pb.UnimplementedAddGetRestaurantServer
	//restaurantList []*pb.Restaurant --> populate this array in the main function
	//while trying server side streaming
}

//for server sider streaming
//get restaurant list -> server side streaming
// func (s *grpcServer) ListRestaurants(req *pb.GetListRequest, stream pb.AddGetRestaurant_ListRestaurantsServer) error{
// 	for _, restaurant := range s.restaurantList{
// 		if err := stream.Send(restaurant); err!=nil {
// 			return err
// 		}
// 	}
// 	return nil
// }

//simple rpc--> sending a single string (i.e. all the objects marshalled into a string)
func (s *grpcServer) ListRestaurants(ctx context.Context, req *pb.GetListRequest) (*pb.RestaurantList, error) {
	//retirieve values from database
	var tempRestaurants []Restaurant
	currPageInt, err := strconv.Atoi(req.CurrentPage)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	postsPerPageInt, err := strconv.Atoi(req.PostsPerPage)
	db.Offset(postsPerPageInt * (currPageInt - 1)).Limit(postsPerPageInt).Order("name asc").Find(&tempRestaurants)
	urlsJson, _ := json.Marshal(tempRestaurants) //convert objects to JSON to send message to the client
	urls := &pb.RestaurantList{RestaurantList: string(urlsJson)}
	return urls, err
}

func (s *grpcServer) GetTotalPosts(ctx context.Context, req *pb.TotalPosts) (*pb.TotalPosts, error) {
	//retirieve values from database
	var tempRestaurants []Restaurant
	// Get all records
	result := db.Find(&tempRestaurants)
	// SELECT * FROM restaurants;
	stringResult := string(result.RowsAffected)
	urls := &pb.TotalPosts{TotalPosts: stringResult} // returns found records count, equals `len(users)`
	return urls, err
} //////////////////////////////////////////CONVERT int64 to string

//simple rpc--> takes in name+address (normalized string) checks uniqueness
func (s *grpcServer) NoRepeatValidation(ctx context.Context, token *pb.NameAddressToken) (*pb.Uniqueness, error) {
	//check if pre-registered
	// SELECT * FROM users WHERE name = 'jinzhu' ORDER BY id LIMIT 1;
	var restaurants []Restaurant
	log.Println(token)
	result := db.Find(&restaurants, "name_address_token = ?", token.NameAddressToken)
	// SELECT * FROM users WHERE nameAddressToken = "nameAddressToken"

	var isUnique string = "not unique"
	if result.RowsAffected == 0 { // returns found records count, equals `len(users)`
		isUnique = "unique"
	}
	response := &pb.Uniqueness{Uniqueness: isUnique}

	return response, err
}

//save new restaurant to database -> simple rpc
func (s *grpcServer) AddRestaurant(ctx context.Context, restaurant *pb.Restaurant) (*pb.AddedConfirmation, error) {
	//read data from request body --> direct acess available. No need to unmarshal
	var existing []Restaurant
	newRestaurant := Restaurant{
		Name:             restaurant.Name,
		Rating:           restaurant.Rating,
		Cuisine:          restaurant.Cuisine,
		Address:          restaurant.Address,
		OpeningTime:      restaurant.OpeningTime,
		CostForTwo:       restaurant.CostForTwo,
		NameAddressToken: restaurant.NameAddressToken,
	}
	db.Where(&Restaurant{NameAddressToken: newRestaurant.NameAddressToken}).Find(&existing)
	if len(existing) == 0 {
		//add to mySQL database
		db.Create(&newRestaurant)
	}

	return &pb.AddedConfirmation{AddedConfirmation: "successfully added new restaurant"}, nil
}

// use godot package to load/read the .env file and
// return the value of the key
func goDotEnvVariable(key string) string {
	// load .env file
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	return os.Getenv(key)
}

func main() {
	// fetch variable values from .env
	username := goDotEnvVariable("USERNAME_DB")
	password := goDotEnvVariable("PASSWORD_DB")

	//connect to mySQL db //////////////////////////////
	db, err = gorm.Open("mysql", username+":"+password+"@tcp(127.0.0.1:3306)/Minizomatodb?charset=utf8&parseTime=True")
	if err != nil {
		log.Println("Connection Failed to open")
	} else {
		log.Println("Connection established with database")
	}
	db.AutoMigrate(&Restaurant{})

	//establish grpc server ////////////////////////////
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterAddGetRestaurantServer(s, &grpcServer{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

}

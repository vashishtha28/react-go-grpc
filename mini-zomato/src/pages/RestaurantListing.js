import React, { useEffect, useState } from "react";
import {useHistory, usehistory} from "react-router-dom";
import Container from "@material-ui/core/Container";
import { AppBar, CssBaseline, Grid, makeStyles, Typography, Fab, Toolbar } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination"
import {Add, Menu} from "@material-ui/icons";
import axios from "axios"
import MyCard from "../components/MyCard"
//import Pagination from "../components/Pagination"

const useStyles = makeStyles((theme)=>({
      fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      root: {
        '& > *': {
          bottom: theme.spacing(0),
          paddingBottom:"10px",
          paddingLeft:"100px",
          marginLeft:"auto",
          marginRight:"auto"
        },
      },
}));


function RestaurantList(){
    const classes = useStyles();
    const history = useHistory();
    const [list, setList] = useState([]);
    const [totalPosts, setTotalPosts] = useState({});
    const postsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoadig] = useState(false);

    //similar to componentDidMount
    useEffect(()=>{
         //get total number of posts
         axios.get("http://localhost:5000/totalposts")
         .then((res)=>{
            setTotalPosts(res.data);
            console.log(res.data);
         })
         .catch((err)=>{
             console.log(err);
         });

    }, []);

    //depended upon current page
    useEffect(()=>{
        //get restaurant list when the page loads
        axios.post("http://localhost:5000/restaurants", {currentPage: currentPage.toString(), postsPerPage: postsPerPage.toString()})
        .then(async (response)=>{
            //console.log(response.data);
            await setList((prev)=>{
                return response.data;
            });
            //console.log(list);
        })
        .catch((err)=>{
            console.log(err);
        });
    },[currentPage] );//add current page in its dependency

     // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  function handlePageChange(event, page){
      console.log("totalPosts");
      console.log(totalPosts);
      event.preventDefault();
      setCurrentPage(page);
      //console.log(page);
      //console.log(currentPage);
      //make request to server with page number and numperpage =5
  }

    return <div>
        <div >
            <AppBar position="fixed" display="block" style={{backgroundColor:"#128C7E"}}>
                <Toolbar>
                    
                    <Typography variant="h6" className={classes.title} >
                        Restaurant Listing
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
        

        {/* <div style={{marginTop:"70px"}}>
            <Pagination
                postsPerPage={postsPerPage}
                totalPosts={list.length}
                paginate={paginate}
                
            />
        </div> */}
        
        <Container component="main" maxWidth="md" style={{paddingTop:"60px"}}>
            <CssBaseline/>
            <Grid container style={{justifyContent:"center"}}>
                {/* Render all cards */}
                {list.map((item)=>{return <MyCard info = {item}/>})}

            </Grid>
            
            <Fab aria-label="Add" className={classes.fab} style={{backgroundColor:"#ffffff"}} href="http://localhost:3000/ztest">
                <Add/>
            </Fab>
            
                
        </Container>
        <Container component="main" maxWidth="xs" display="flex" style={{paddingTop:"10px"}}>
            <CssBaseline/>
                 <div className={classes.root}>
                    <Pagination 
                        count={3} 
                        variant="outlined" 
                        shape="rounded" 
                        page={currentPage}
                        onChange={handlePageChange}
                        

                    />
                </div>
            
        </Container>
    </div>

}
export default RestaurantList;
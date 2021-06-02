import React, { useEffect, useState } from "react";
import {useHistory, usehistory} from "react-router-dom";
import Container from "@material-ui/core/Container";
import { AppBar, CssBaseline, Grid, makeStyles, Typography, Fab, Toolbar } from "@material-ui/core";
import {Add, Menu} from "@material-ui/icons";
import axios from "axios"
import MyCard from "../components/MyCard"

const useStyles = makeStyles((theme)=>({
      fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
}));


function RestaurantList(){
    const classes = useStyles();
    const history = useHistory();
    const [list, setList] = useState([]);

    useEffect(()=>{
        //get restaurant list when the page loads
        axios.get("http://localhost:5000/restaurants")
        .then(async (response)=>{
            console.log(response.data);
            await setList((prev)=>{
                return response.data;
            });
            console.log(list);
        })
        .catch((err)=>{
            console.log(err);
        });
    },[] );

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
    </div>

}
export default RestaurantList;
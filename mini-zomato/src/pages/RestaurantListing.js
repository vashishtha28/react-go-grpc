import React, { useEffect, useState } from "react";
import {useHistory, usehistory} from "react-router-dom";
import Container from "@material-ui/core/Container";
import { AppBar, CssBaseline, Grid, makeStyles, Typography, Fab, Toolbar } from "@material-ui/core";
import {Add, Menu} from "@material-ui/icons";
import axios from "axios"

const useStyles = makeStyles((theme)=>({
      paper: {
        margin: "10px 5px",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: "1px 1px 3px grey",
        borderRadius:"5px"
      },
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

    function cardBuilder(item){
        return <Grid item xs={12} sm={5} lg={4} className={classes.paper} >
                <Grid container spacing={1} >
                    <Grid item xs={4} style={{padding:"10px"}}>
                        <img src="https://img.buzzfeed.com/thumbnailer-prod-us-east-1/video-api/assets/216054.jpg" width="100%" height="100%"></img>
                    </Grid>
                    <Grid item xs={8}>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <div style={{color:"red"}}>
                                Opens at {item.openingTime}
                            </div>
                            <div>
                                <Grid container>
                                    <Grid item xs={10}>
                                        <Typography comoponent="h6" variant="h6"><strong>{item.name}</strong></Typography>
                                        <div style={{color:"grey"}}>
                                            {item.cuisine}
                                        </div>
                                        <div style={{color:"grey"}}>
                                            {item.address}
                                        </div>
                                        <div style={{color:"grey"}}>
                                            Rs. {item.costForTwo} for two 
                                        </div>

                                    </Grid>
                                    <Grid item xs={2} style={{textAlign:"center"}}>
                                        <div style={{display: "flex", flexDirection: "column", justifyContent:"flex-start", background:"#34B207", width:"25px", height:"25px", marginLeft:"auto", marginRight:"auto", paddingTop:"2px", paddingBottom:"auto", color:"white"}}>
                                            <div>{item.rating}</div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>

                        </div>
                    </Grid>
                </Grid>
            </Grid>

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
        
        <Container component="main" maxWidth="md" style={{paddingTop:"60px"}}>
            <CssBaseline/>
            <Grid container style={{justifyContent:"center"}}>
                {/* Render all cards */}
                {list.map((item)=>{return cardBuilder(item);})}

            </Grid>
            <Fab aria-label="Add" className={classes.fab} style={{backgroundColor:"#ffffff"}} href="http://localhost:3000/ztest">
                <Add/>
            </Fab>
                
        </Container>
    </div>

}
export default RestaurantList;
import React from "react";
import {Grid, Typography, makeStyles} from "@material-ui/core";
const useStyles = makeStyles((theme)=>({
    paper: {
      margin: "10px 5px",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: "1px 1px 3px grey",
      borderRadius:"5px"
    }
}));

function MyCard(props){
    const classes = useStyles();
    const item = props.info;
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

export default MyCard;
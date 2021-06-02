import { Typography, CssBaseline, Container, Toolbar, AppBar, Grid, TextField, makeStyles, Button } from "@material-ui/core";
import React, {useState} from "react";
import { useHistory } from "react-router";
import axios from "axios"

const useStyles = makeStyles((theme)=>({
    paper: {
        //marginTop: theme.spacing(8),
        marginTop:"20px",
        display: 'flex',
        flexDirection: 'column',
        
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
      },
      submit: {
        width:"100%",
        margin: theme.spacing(3, 0, 2),
      },

}));


function Ztest(){
    const classes = useStyles();
    const history = useHistory();
    const [data, setData] = useState({
        name:"",
        rating:"",
        cuisine:"",
        address:"",
        openingTime:"",
        costForTwo:""
    });

    function handleChange(event){
        event.preventDefault();
        setData((prev)=>{
            return {...prev, [event.target.name]:event.target.value};
        })
    }
    function handleSubmit(event){
        event.preventDefault();
        console.log(data);
        //check if something is empty
        if(data.name===""||data.rating===""||data.cuisine===""||data.address===""||data.openingTime===""||data.costForTwo===""){
            alert("Some fields were left empty. Please fill all");
        }
        else{
            //make http post request with the form data
            axios.post("http://localhost:5000/add", data)
            .then((response)=>{
                console.log(response);
            })
            .catch((err)=>{
                console.log(err);
            })
            .then(()=>{
                setData({
                    name:"",
                    rating:"",
                    cuisine:"",
                    address:"",
                    openingTime:"",
                    costForTwo:""
                });
                history.push("/");
            });
        }
        
    }

    return<div>
        <div >
            <AppBar position="fixed" display="block" style={{backgroundColor:"#128C7E"}}>
                <Toolbar>
                    
                    <Typography variant="h6" className={classes.title} >
                    Ztest
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
        
        <Container component="main" maxWidth="sm" style={{paddingTop:"60px", alignContent:"center"}}>
            <CssBaseline/>
            <div className={classes.paper} >
                  <Typography variant="h5" align="left">
                    Add restaurant
                  </Typography>
                  <form className={classes.form} noValidate>
                    <TextField
                        
                        name="name"
                        id="name"
                        label="Name"
                        placeholder="Restaurant name"
                        fullWidth
                        onChange={handleChange}
                        value={data.name}
                        
                    />
                    <TextField
                        
                        name="rating"
                        id="rating"
                        label="Rating"
                        placeholder="Restaurant rating"
                        fullWidth
                        onChange={handleChange}
                        value={data.rating}
                        style={{marginTop:"10px"}}
                        
                    />
                    <TextField
                        
                        name="cuisine"
                        id="cuisine"
                        label="Cuisine"
                        placeholder="Cuisines served by this restaurant"
                        fullWidth
                        onChange={handleChange}
                        value={data.cuisine}
                        style={{marginTop:"10px"}}
                        
                    />
                    <TextField
                        
                        name="address"
                        id="address"
                        label="Address"
                        placeholder="Full address of the restaurant"
                        fullWidth
                        onChange={handleChange}
                        value={data.address}
                        style={{marginTop:"10px"}}
                        
                    />
                    <TextField
                        
                        name="openingTime"
                        id="openingTime"
                        label="Timings"
                        placeholder="Restaurant opening timings"
                        fullWidth
                        onChange={handleChange}
                        value={data.openingTime}
                        style={{marginTop:"10px"}}
                        
                    />
                    
                    <TextField
                        
                        name="costForTwo"
                        id="costForTwo"
                        label="CFT"
                        placeholder="Cost for two at the restaurant (approx.)"
                        fullWidth
                        onChange={handleChange}
                        value={data.costForTwo}
                        style={{marginTop:"10px"}}
                        
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit}
                        style={{backgroundColor:"#34B207"}}
                        
                        >
                        ADD
                    </Button>
                  </form>  
                </div>    
            

            
                
        </Container>
    </div>

}
export default Ztest;
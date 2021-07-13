import { 
    Typography, 
    CssBaseline, 
    Container, 
    Toolbar, 
    AppBar, 
    Grid, 
    TextField, 
    makeStyles, 
    Button, 
    useTheme, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Input, 
    Chip,
    Slider,
    createMuiTheme,
    ThemeProvider, 
} from "@material-ui/core";

import {Star} from "@material-ui/icons"

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
      formControl: {
        minWidth: "100%",
        marginTop: "8px"
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
      noLabel: {
        marginTop: theme.spacing(3),
      },
      container: {
        display: "flex",
        flexWrap: "wrap"
      },
      textField: {
        width: "100%",
        marginTop: "10px"
      },
      root: {
        width: 250
      },
      input: {
        width: 42
      }

}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const cuisineList = [
    "Bar",
    "Burger",
    "Chinese",
    "Italian",
    "Punjabi",
    "Rajasthani",
    "South Indian",
    "Fast Food",
    "Biryani"

  ];

function getStyles(cuisine, selectedCuisines, theme) {
return {
    fontWeight:
    selectedCuisines.indexOf(cuisine) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
};
}

function Ztest(){
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const [selectedCuisines, setSelectedCuisines] = useState([]);

    const [data, setData] = useState({
        name:"",
        //rating:"",
        //cuisine:[],
        address:"",
        openingTime:"10:00",
        costForTwo:""
    });
    const [rating, setRating] = React.useState(3.5);

    const handleSliderChange = (event, newRating) => {
        setRating(newRating);
    };

    const handleInputChange = (event) => {
        setRating(event.target.value === "" ? "" : Number(event.target.value));
    };

    const handleBlur = () => {
        if (rating < 1) {
        setRating(1);
        } else if (rating > 5) {
        setRating(5);
        }
    };

    const muiTheme = createMuiTheme({
        overrides: {
        MuiSlider: {
            thumb: {
            height: 27,
            width: 27,
            backgroundColor: '#fff',
            border: '1px solid currentColor',
            marginTop: -12,
            marginLeft: -13,
            boxShadow: '#ebebeb 0 2px 2px',
            '&:focus, &:hover, &$active': {
                boxShadow: '#ccc 0 2px 3px 1px',
            },
            '& .bar': {
                // display: inline-block !important;
                height: 9,
                width: 1,
                backgroundColor: 'currentColor',
                marginLeft: 1,
                marginRight: 1,
            },
            },
            track: {
            height: 3,
            },
            rail: {
            color: '#d8d8d8',
            opacity: 1,
            height: 3,
            },
        }
        }
    });

    function cuisineSelectChange(event){
        setSelectedCuisines(event.target.value);
    }

    function cuisineMultipleChange(event){
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
            value.push(options[i].value);
            }
        }
        setSelectedCuisines(value);
        setData((prev)=>{
            return {...prev, cuisine:value};
        });
    }

    function handleChange(event){
        event.preventDefault();
        setData((prev)=>{
            return {...prev, [event.target.name]:event.target.value};
        });
    }
    function handleSubmit(event){
        
        event.preventDefault();
        console.log(data);
        //check if something is empty
        if(data.name===""||rating===""||selectedCuisines===[]||data.address===""||data.openingTime===""||data.costForTwo===""){
            alert("Some fields were left empty. Please fill all");
        }
        else{
            var cuisineString = "";
            var nameAddressToken = ((((data.name + data.address).replace(/\s+/g, "")).replace(/,/g, '')).replace(/-/g, '')).toLowerCase();
            selectedCuisines.map((cuisine)=>{
                if(selectedCuisines.indexOf(cuisine)!== 0) cuisineString = cuisineString + ", ";
                cuisineString = cuisineString + cuisine;
            });

            const toSend = {
                name: data.name,
                rating: rating.toString(),
                cuisine: cuisineString,
                address: data.address,
                openingTime: data.openingTime,
                costForTwo: data.costForTwo,
                nameAddressToken: nameAddressToken
            }
            console.log(toSend);
            //check with nameAddressToken
            // axios.post("http://localhost:5000/check/uniqueness", {nameAddressToken: nameAddressToken})
            // .then((response)=>{
            //     console.log(response.data);
            //     if(response.data==="unique"){

                     

            //     }else{
            //         alert("Restaurant already registered");
            //         setData({
            //             name:"",
            //             //rating:"",
            //             //cuisine:[],
            //             address:"",
            //             openingTime:"",
            //             costForTwo:""
            //         });
            //         setSelectedCuisines([]);

            //     }
            // })
            // .catch((err)=>{
            //     console.log(err);
            // });

            //make http post request with the form data
            axios.post("http://localhost:5000/add", toSend)
            .then((response)=>{
                console.log(response);
            })
            .catch((err)=>{
                console.log(err);
            })
            .then(()=>{
                setData({
                    name:"",
                    //rating:"",
                    //cuisine:[],
                    address:"",
                    openingTime:"",
                    costForTwo:""
                });
                setSelectedCuisines([]);
                history.push("/");
            });
            
        }
        
    }

    function handleCancel(event){
        event.preventDefault();
        setData({
            name:"",
            //rating:"",
            //cuisine:[],
            address:"",
            openingTime:"",
            costForTwo:""
        });
        setSelectedCuisines([]);
        history.push("/");

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
                    <Typography id="input-slider" gutterBottom style={{marginTop:"15px", color:"grey"}}>
                        Restaurant Rating
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item style={{ color: "#FDCC0D" }}>
                            <Star />
                        </Grid>
                        <Grid item xs>
                            <ThemeProvider theme={muiTheme}>
                                <Slider
                                    name="rating"
                                    id="rating"
                                    label="Rating"
                                    value={typeof rating === "number" ? rating : 0}
                                    max={5}
                                    min={1}
                                    step={0.1}
                                    onChange={handleSliderChange}
                                    aria-labelledby="input-slider"
                                    style={{ color: "#FDCC0D" }}
                                />
                            </ThemeProvider>
                        </Grid>
                        <Grid item>
                            <Input
                                className={classes.input}
                                value={rating}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                step: 0.1,
                                min: 1,
                                max: 5,
                                type: "number",
                                "aria-labelledby": "input-slider"
                                }}
                            />
                        </Grid>
                    </Grid>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="mutiple-chip-label">
                            Cuisines
                        </InputLabel>
                        <Select
                            labelId="mutiple-chip-label"
                            id="mutiple-chip"
                            multiple
                            value={selectedCuisines}
                            onChange={cuisineSelectChange}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {cuisineList.map((cuisine) => (
                                <MenuItem key={cuisine} value={cuisine} style={getStyles(cuisine, selectedCuisines, theme)}>
                                {cuisine}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    <form className={classes.container} noValidate>
                        <TextField
                            id="openingTime"
                            name="openingTime"
                            label="Opening Time"
                            type="time"
                            value = {data.openingTime}
                            onChange = {handleChange}
                            className={classes.textField}
                            InputLabelProps={{
                            shrink: true
                            }}
                            inputProps={{
                            step: 300 // 5 min
                            }}
                        />
                    </form>
                    <TextField
                        
                        name="costForTwo"
                        id="costForTwo"
                        label="CFT"
                        type="number"
                        placeholder="Cost for two at the restaurant (approx.)"
                        fullWidth
                        onChange={handleChange}
                        value={data.costForTwo}
                        style={{marginTop:"10px"}}
                        
                    />
                    <Grid container spacing={1} >
                        <Grid item xs={6} md={6} style={{padding:"10px"}}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="primary"
                                className={classes.submit}
                                onClick={handleCancel}
                                style={{borderColor: "#f44336", color:"#f44336"}}
                                
                                >
                                CANCEL
                            </Button>
                        </Grid>
                        <Grid item xs={6} md={6} style={{padding:"10px"}}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmit}
                                style={{backgroundColor:"#4CAF50"}}
                                
                                >
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                  </form>  
                </div>    
            

            
                
        </Container>
    </div>

}
export default Ztest;
import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import RestaurantListing from "../pages/RestaurantListing";
import Ztest from "../pages/Ztest";

function Main(){
    return <div>
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <RestaurantListing />
                </Route>
                <Route exact path="/ztest">
                    <Ztest />
                </Route>
        </Switch>
        </BrowserRouter>
        
    </div>
}

export default Main;
import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import ListView from "./components/ListView";
import SignIn from "./components/Auth/SignIn";
import Login from "./components/Auth/Login";
import ContextProvider from "./components/ContextProvider";

function App() {
  return (
    <div className="App">
      <ContextProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route path="/ListView" component={ListView}></Route>
            <Route path="/SignIn" component={SignIn}></Route>
            <Route path="/Login" component={Login}></Route>
          </Switch>
        </BrowserRouter>
      </ContextProvider>
    </div>
  );
}

export default App;

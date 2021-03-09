import * as React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import ListView from "./components/ListView";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/ListView" component={ListView}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

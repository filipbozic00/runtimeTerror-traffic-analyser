import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Title, Navigation, Footer, Home } from "./components"
import { AboutUs } from "./components"
import { Images } from "./components"
import { Map } from "./components"

function App() {
  return (
    <div className="App bg-secondary pb-5 h-100">
      <Router>
        <Title />
        <Navigation />
        <Switch>
          <Route path="/" exact>
            <Home/> 
          </Route>
          <Route path="/map" exact>
            <Map/> 
          </Route>
          <Route path="/images" exact>
            <Images/> 
          </Route>
          <Route path="/aboutus" exact>
            <AboutUs/> 
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

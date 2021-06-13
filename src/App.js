import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import './App.css';

// pages
import { Example, Aliens } from "./pages";

function App() {
  return (
    <div className="App">
      <Router>
        <h3>Main App</h3>
        <Link to="/example">Example page</Link><br />
        <Link to="/aliens">Aliens page</Link>
        <Switch>
          <Route path="/example"><Example /></Route>
          <Route path="/aliens"><Aliens /></Route>
        </Switch>
      </Router>
    </div >
  );
}

export default App;

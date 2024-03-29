import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import State from "./pages/State/StatePage";

// pages
import { Example, Aliens } from "./pages";

function App() {
    return (
        <div className="App">
            <Router>
                <div className="nav">
                    <h3>Main App</h3>
                    <Link to="/example">Example page</Link><br />
                    <Link to="/aliens">Aliens page</Link>
                    <State />
                </div>
                <Switch>
                    <Route path="/example"><Example /></Route>
                    <Route path="/aliens"><Aliens /></Route>
                </Switch>
            </Router>
        </div >
    );
}

export default App;

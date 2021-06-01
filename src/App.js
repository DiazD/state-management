import './App.css';

import { dispatch, useSubscription, state } from "./jekyll";

const inc = (value) => value + 1;
const incEvent = (event) => () => dispatch([event]);

const paths = [
  ["list", "multiplier"],
  ["list", "counter"],
];

const counterPath = ["list", "counter"];

const style = {
  textAlign: "left",
  backgroundColor: "lightgray",
  padding: "2rem",
  margin: "2rem",
  borderRadius: "20px",
}

function App() {
  const vals = useSubscription(paths, (multiplier, counter) => multiplier * counter)
  const [counter] = useSubscription(counterPath);
  const [user] = useSubscription(["users", counter]);

  const addNewUser = () => {
    const user = {
      id: counter,
      name: `john-${counter}`,
    }
    dispatch(["add_user", { counter, user }])
  };

  const resetUsers = () => dispatch(["reset_users"]);

  return (
    <div className="App">
      {user ? <h1>{user.name}</h1> : null}
      <h4>{vals}</h4>
      <button onClick={addNewUser}>Add User</button>
      <button onClick={resetUsers}>Reset Users</button>
      <div>
        multiplier
        <button onClick={incEvent("inc_multiplier")}>+</button>
      </div>
      <div>
        counter
        <button onClick={incEvent("inc_counter")}>+</button>
      </div>
      <pre style={style}>
        <code>
          {JSON.stringify(state, null, 2)}
        </code>
      </pre>
    </div >
  );
}

export default App;

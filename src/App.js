import './App.css';

import { dispatch, useSubscription, state } from "./jekyll";

const incEvent = (event) => () => dispatch([event]);

const counterPath = ["list", "counter"];
const paths = [
  ["list", "multiplier"],
  counterPath,
];

const style = {
  textAlign: "left",
  backgroundColor: "lightgray",
  padding: "2rem",
  margin: "2rem",
  borderRadius: "20px",
};

const addNewUser = () => dispatch(["add_user"]);
const resetUsers = () => dispatch(["reset_users"]);

const Counter = () => {
  const [counter] = useSubscription(counterPath);

  return (
    <div>{counter}</div>
  );
}

const Header = () => {
  const vals = useSubscription(paths, (multiplier, counter) => multiplier * counter)
  const [counter] = useSubscription(counterPath);

  const [user] = useSubscription(["users", counter]);
  return (
    <div>
      {user ? <h1>{user.name}</h1> : null}
      <h4>{vals}</h4>
    </div>
  )
};

const Store = () => {
  const [users] = useSubscription(["users"]);
  console.log('users: ', users);
  return (
    <pre style={style}>
      <code>
        {JSON.stringify(state, null, 2)}
      </code>
    </pre>

  );
};

function App() {
  return (
    <div className="App">
      <Header />
      <button onClick={addNewUser}>Add User</button>
      <button onClick={resetUsers}>Reset Users</button>
      <Counter />
      <div>
        multiplier
        <button onClick={incEvent("inc_multiplier")}>+</button>
      </div>
      <div>
        add
        <button onClick={incEvent("inc_counter")}>+</button>
      </div>
      <Store />
    </div >
  );
}

export default App;

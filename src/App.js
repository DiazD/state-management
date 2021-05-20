import './App.css';

import { dispatch, useQuery, state } from "./jekyll";

const inc = (value) => value + 1;
const incEvent = (path) => () => dispatch({ path, updateFn: inc });

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
  const vals = useQuery(paths, (multiplier, counter) => multiplier * counter)
  const [counter] = useQuery(counterPath);
  const [user] = useQuery(["users", counter]);

  const addNewUser = () => {
    const user = {
      id: counter,
      name: `john-${counter}`,
    }
    dispatch({
      path: ["users", counter],
      updateFn: (_, newUser) => newUser,
      args: user
    })
  };

  const resetUsers = () => dispatch({ path: ["users"], updateFn: () => ({}) });

  return (
    <div className="App">
      {user ? <h1>{user.name}</h1> : null}
      <h4>{vals}</h4>
      <button onClick={addNewUser}>Add User</button>
      <button onClick={resetUsers}>Reset Users</button>
      <div>
        multiplier
        <button onClick={incEvent(["list", "multiplier"])}>+</button>
      </div>
      <div>
        counter
        <button onClick={incEvent(["list", "counter"])}>+</button>
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

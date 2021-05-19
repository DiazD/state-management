import './App.css';

import { dispatch, useQuery } from "./jekyll";

const inc = (value) => value + 1;
const incEvent = (path) => () => dispatch({ path, updateFn: inc });

const paths = [
  ["list", "multiplier"],
  ["list", "counter"],
];

const counterPath = ["list", "counter"];

function App() {
  // const [multiplier, counter] = useQuery(paths);
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

  return (
    <div className="App">
      {user ? <h1>{user.name}</h1> : null}
      <h4>{vals}</h4>
      <button onClick={addNewUser}>Add User</button>
      <div>
        multiplier
        <button onClick={incEvent(["list", "multiplier"])}>+</button>
      </div>
      <div>
        counter
        <button onClick={incEvent(["list", "counter"])}>+</button>
      </div>
    </div >
  );
}

export default App;

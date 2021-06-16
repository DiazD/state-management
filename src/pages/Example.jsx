import { Page } from "../components";
import { dispatch, useSubscription, state } from "../jekyll";
import { selectKeys } from "../operators";

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
  const [counter, multiplier] = useSubscription(paths);

  const [user] = useSubscription(["users", counter]);
  return (
    <div>
      {user ? <h1>{user.name}</h1> : null}
      <h4>{counter * multiplier}</h4>
    </div>
  )
};

const Store = () => {
  const [users, list] = useSubscription([["users"], ["list"]]);
  console.log('users: ', users, list);
  return (
    <pre style={style}>
      <code>
        {JSON.stringify(selectKeys(["list", "users"], state), null, 2)}
      </code>
    </pre>

  );
};

const Example = () => {
  return (
    <Page title="Example">
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
    </Page>
  );
};

export default Example;

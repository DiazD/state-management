### Description
This is a thought exercise in implementing a state management system in React. This is still work in progress but the meat of the functionality is there.


### Usage
The state is a plain javascript object, so first thing is to initialize it to some inital value.

```js
file: src/jekyll.js

// our initial state
let state = {
  list: { counter: 0, multiplier: 1},
  users: { }
}

...
```

In order for us to `view` the data in our component, we use the `useQuery` hook, to query our data from our state tree.
We provide a `path` to the data we want to view, this path is used to traverse the tree.

```js

const [multiplier] = useQuery(["list", "multiplier"]);
const [counter] = useQuery(["list", "counter"]);
const [users] = useQuery(["users"]);
```

We can also query our state for multiple paths in 1 hook call and apply a transformation function to it

```js
const [multiplier, counter] = useQuery([
  ["list", "multiplier"],
  ["list", "counter"],
]);

// we can pass a transformation function to useQuery to output some computed value
const computedValue = useQuery(
  [
    ["list", "multiplier"],
    ["list", "counter"],
  ],
  (multiplier, counter) => multiplier * counter,
)
```

To update state we utilize the `dispatch` function which takes a path to update, an `update function` and some extra args. The update function has the following signature:

```js
// update function definition
const myUpdateFn = (currentStatePointedByPath, args) => newValueToStoreInPath;


// lets update the counter
const inc = (currentValue) => currentValue + 1;
dispatch({ path: ["list", "counter"], updateFn: inc });

// or with an argument
const incByFactor = (currentValue, factor) => currentValue + factor;
dispatch({ path: ["list", "counter"], updateFn: incByFactor, args: 10});
```

**currentValue:** is the value that's pointed by `path`
**factor:** is the value specified by `args`
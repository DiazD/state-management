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

In order for us to `view` the data in our component, we use the `useSubscription` hook, to query our data from our state tree.
We provide a `path` to the data we want to view, this path is used to traverse the tree.

```js

const [multiplier] = useSubscription(["list", "multiplier"]);
const [counter] = useSubscription(["list", "counter"]);
const [users] = useSubscription(["users"]);
```

We can also query our state for multiple paths in 1 hook call and apply a transformation function to it

```js
const [multiplier, counter] = useSubscription([
  ["list", "multiplier"],
  ["list", "counter"],
]);

// we can pass a transformation function to useSubscription to output some computed value
const computedValue = useSubscription(
  [
    ["list", "multiplier"],
    ["list", "counter"],
  ],
  (multiplier, counter) => multiplier * counter,
)
```

### Updating State
To update state we utilize the `dispatch` function to emit an `event` which are handled by event handlers.
The dispatch function accepts an array which is componed of an `event-name`, first argument, and optionally event data as the second argument.

```js
// dispatch an event with no data
dispatch(["inc-counter"]);

// dispatch an event w/ data
dispatch(["add-user", newUser]);
```

In order for events to be handled, we need to register them to some global registrar. To do this we use the `registerEvent` function which accepts an object of the following shape:

```js
{
  event,
  paths,
  handler
}
```

- **event:** The event name
- **paths:** The paths you want injected into your `handler` function as the first parameter
- **handler:** The handler function that computes the side effects(new value) to our global state.

The handler is a function from `paths values`, as first argument and `eventData` as the second argument.
The return value is an array of path side effects.

```js
// example of registerEvent
registerEvent({
  event: "add-user",
  paths: [["list", "counter"]],
  handler: ([counter]) => {
    // compute the paths that need to update
    return [
      { path: ["users", counter], data: { id: counter, name: `my-user-${counter}`}}
    ];
  }
});
// example of add-user
dispatch(["add-user"]);

// another example with event data
registerEvent({
  event: "inc-counter",
  paths: [["list", "counter"]],
  handler: ([counter], incrementBy) => {
    return [
      { path: ["list", "counter"], data: counter + incrementBy}
    ];
  }
});

// example of how to call `inc-counter`
dispatch(["inc-counter", 10]);
```

The handlers return could return a million of side effects to our global state tree.
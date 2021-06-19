import { useEffect, useReducer } from "react";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { updateIn, getIn, arrayPartialEQ, normalize, any } from "./operators";
import { data } from "./resources/mockData";

export let state = {
  list: { counter: 0, multiplier: 1 },
  users: {},
  aliens: normalize(data),
  ui: { aliens: { selections: [], aliensBeingEdited: [] } }
};

const subject$ = new Subject();

const singlePath = (paths) => !Array.isArray(paths[0]);

const subscriptionState = {
  data: [],
  reducedData: null
}
const reducer = (state = subscriptionState, { type, payload }) => {
  switch (type) {
    case "SET_DATA": {
      return { ...state, data: payload.data, reducedData: payload.reducedData };
    }
    default:
      return state;
  }
};

const noPathChanged = (newData, data) => !any(newData.map((d, idx) => d !== data[idx]));

const useGetPathValue = (paths, transformationFn) => {
  const init = paths.map(path => getIn(path, state));
  const [data, dispatch] = useReducer(reducer, { data: init, reducedData: transformationFn(...init) });

  // filter function to only update state if the incoming change from
  // the stream matches a path we're watching via `paths` AND the
  // incoming value isn't the same as the old value
  const filterBy = ([path_, value]) => {
    const pathMatched = paths.findIndex(path => arrayPartialEQ(path_, path));

    // if path not matched then let the value flow
    if (pathMatched === -1) return false;
    return true;
  }

  useEffect(() => {
    const subscription = subject$
      .pipe(filter(filterBy))
      .subscribe(() => {
        // fetch new data from state and compute the computed state for the subscription
        const newData = paths.map((path) => getIn(path, state));
        const reducedData = transformationFn(...newData);

        // if the paths didn't change then just return and don't notify the subscription
        if (noPathChanged(newData, data.data)) return;

        // if computed state changes then save it and trigger re-render
        if (reducedData !== data.reducedData) {
          dispatch({ type: "SET_DATA", payload: { data: newData, reducedData } });
        }
      })
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [paths]);
  return data.reducedData;
};

export const useSubscription = (paths_, transformationFn = (...x) => x) => {
  // normalize paths
  const isSinglePath = singlePath(paths_);
  const paths = isSinglePath ? [paths_] : paths_;

  const values = useGetPathValue(paths, transformationFn);
  return values
};

const events = {};

const handleEvent = (sideEffects) => {
  // for each side effect, update the path with the value provided
  sideEffects.forEach(([event, eventData]) => {
    const { handler, paths = [] } = events[event];
    const data = paths.length === 0 ? { ...state } : paths.map((path) => getIn(path, state));
    const computedState = handler(data, eventData);

    computedState.forEach(({ path, data }) => {
      const newState = updateIn(path, (_, newValue) => newValue, data, { ...state });
      state = newState;

      // retrieve the new computed value and return
      const returnVal = getIn(path, state);
      subject$.next([path, returnVal]);
    })
  });
}

export const dispatch = (event) => {
  let events = event;
  if (!Array.isArray(event[0])) {
    events = [event];
  }

  handleEvent(events);
};

export const registerEvent = ({ event, ...eventData }) => {
  events[event] = eventData;
};

// add user event
registerEvent({
  event: "add_user",
  paths: [["list", "counter"], ["users"]],
  handler: ([counter, users]) => users[counter] === undefined ?
    [{ path: ["users", counter], data: { id: counter, name: `john-${counter}` } }] :
    []
});

// increment counter
registerEvent({
  event: "inc_counter",
  paths: [["list", "counter"]],
  handler: ([counter]) => ([
    { path: ["list", "counter"], data: counter + 1 }
  ]),
});

// increment multiplier
registerEvent({
  event: "inc_multiplier",
  paths: [["list", "multiplier"]],
  handler: ([multiplier]) => ([
    { path: ["list", "multiplier"], data: multiplier + 1 }
  ]),
});

// reset users
registerEvent({
  event: "reset_users",
  handler: () => ([
    { path: ["users"], data: {} }
  ]),
});

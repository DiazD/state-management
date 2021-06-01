import { useState, useEffect } from "react";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { updateIn, getIn, arrayEQ } from "./operators";

export let state = {
  list: { counter: 0, multiplier: 1 },
  users: {},
};

const subject$ = new Subject();

const singlePath = (paths) => !Array.isArray(paths[0]);

const useGetPathValue = (paths) => {
  const init = paths.map(path => getIn(path, state));
  const [data, setData] = useState(init);
  // filter function to only update state if the incoming change from
  // the stream matches a path we're watching via `paths` AND the
  // incoming value isn't the same as the old value
  const filterBy = ([path_, value]) => {
    const pathMatched = paths.findIndex(path => arrayEQ(path_, path));

    // if path not matched then let the value flow
    if (pathMatched === -1) return false;

    const partial = data[pathMatched];
    return pathMatched !== -1 && partial !== value;
  }

  useEffect(() => {
    const subscription = subject$
      .pipe(filter(filterBy))
      .subscribe(([path_, value]) => {
        setData(data => {
          // find the position the path points to in order to update the proper slot
          const idx = paths.findIndex(path => arrayEQ(path, path_));

          // update state
          const newData = [...data];
          newData[idx] = value;

          return newData;
        });
      })
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [paths]);

  return data;
};

export const useSubscription = (paths_, transformationFn = (...x) => x) => {
  // normalize paths
  const isSinglePath = singlePath(paths_);
  const paths = isSinglePath ? [paths_] : paths_;

  const values = useGetPathValue(paths);
  return transformationFn(...values);
};

const events = {};

const updateState = (updates) => {
  updates.forEach(([event, eventData]) => {
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

  updateState(events);
};

export const registerEvent = ({ event, ...eventData }) => {
  events[event] = eventData;
}

// register add user
registerEvent({
  event: "add_user",
  handler: (db, data) => ([
    { path: ["users", data.counter], data: data.user }
  ])
});

registerEvent({
  event: "inc_counter",
  paths: [["list", "counter"]],
  handler: ([counter]) => ([
    { path: ["list", "counter"], data: counter + 1 }
  ]),
});

registerEvent({
  event: "inc_multiplier",
  paths: [["list", "multiplier"]],
  handler: ([multiplier]) => ([
    { path: ["list", "multiplier"], data: multiplier + 1 }
  ]),
});

registerEvent({
  event: "reset_users",
  handler: () => ([
    { path: ["users"], data: {} }
  ]),
});

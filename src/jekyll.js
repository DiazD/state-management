import { useState, useEffect } from "react";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { updateIn, getIn, arrayEQ, all, any } from "./operators";

let state = {
  list: { counter: 0, multiplier: 1 },
  users: {},
};

const subject$ = new Subject();

const updateState = (updates) => {
  updates.forEach(({ path, updateFn, args }) => {
    const newState = updateIn(path, updateFn, args, { ...state });
    state = newState;

    // retrieve the new computed value and return
    const returnVal = getIn(path, state);
    subject$.next([path, returnVal]);
  });
}

export const dispatch = (event) => {
  let events = event;
  if (!Array.isArray(event)) {
    events = [event];
  }

  updateState(events);
};

const singlePath = (paths) => !Array.isArray(paths[0]);

export const useQuery = (paths_, transformationFn = (...x) => x) => {
  // normalize paths
  const paths = singlePath(paths_) ? [paths_] : paths_;

  // init state -- fetch values from state
  const init = paths.map(path => getIn(path, state));
  const [data, setData] = useState(init);

  // filter function to only update state if the incoming change from
  // the stream matches a path we're watching via `paths` AND the
  // incoming value isn't the same as the old value
  const filterBy = ([path_, value]) => {
    const pathMatched = paths.findIndex(path => arrayEQ(path_, path));

    if (pathMatched === -1) return false;
    const partial = data[pathMatched];
    return pathMatched !== -1 && partial !== value;
  }

  // subscribe to the store
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

          // transform the data and decide whether to wrap it into an array or not
          const transformedData = transformationFn(...newData);
          const newState = !Array.isArray(transformedData) ? [transformedData] : transformedData;

          return newState
        });
      })
    return () => subscription.unsubscribe();
    // eslint-disable-next-line
  }, [paths]);

  return data;
};

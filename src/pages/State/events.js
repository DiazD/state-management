import { registerEvent } from "../../jekyll";

registerEvent({
  event: "ui-state-set-paths-to-view",
  paths: [["ui", "state", "viewedPaths"]],
  handler: ({ viewedPaths }, result) => ([
    { path: ["ui", "state", "viewedPaths"], data: [...viewedPaths, { ...result, value: result.value.split(",") }] }
  ])
});

registerEvent({
  event: "ui-state-show-tree",
  paths: [["ui", "state", "showStateTree"]],
  handler: ({ showStateTree }, data) => ([
    { path: ["ui", "state", "showStateTree"], data }
  ])
});

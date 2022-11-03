import { registerEvent } from "../../jekyll";

registerEvent({
    event: "ui-state-set-paths-to-view",
    paths: [["ui", "state", "viewedPaths"]],
    handler: ({ viewedPaths }, result) => ({
        state: [
            {
                path: ["ui", "state", "viewedPaths"],
                data: [...viewedPaths, { ...result, value: result.value.split(",") }]
            },
        ],
    })
});

registerEvent({
    event: "ui-state-show-tree",
    // NOTE: I don't think I need the path....
    paths: [["ui", "state", "showStateTree"]],
    handler: ({ showStateTree }, data) => ({
        state: [
            { path: ["ui", "state", "showStateTree"], data }
        ]
    })
});

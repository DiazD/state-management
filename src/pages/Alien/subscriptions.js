import { append } from "ramda";
import { registerEvent } from "../../jekyll";
import { mapObject } from "../../operators";

registerEvent({
  event: "update-alien",
  handler: (_, data) => ([
    { path: ["aliens", data.id], data },
  ]),
});

registerEvent({
  event: "inc-alien-age",
  paths: [["aliens"]],
  handler: ([aliens]) => ([
    {
      path: ["aliens"],
      data: mapObject(
        (alien) => {
          alien.age += 1;
          return alien;
        },
        aliens
      )
    }
  ])
});

registerEvent({
  event: "upcase-alien-name",
  paths: [["aliens"]],
  handler: ([aliens]) => ([
    {
      path: ["aliens"],
      data: mapObject(
        (alien) => {
          alien.first_name = alien.first_name.toUpperCase();
          alien.last_name = alien.last_name.toUpperCase();
          return alien;
        },
        aliens
      )
    }
  ])
});

registerEvent({
  event: "ui-select-alien",
  paths: [["ui", "aliens", "selections"]],
  handler: ([selections], { id, add }) => {
    const data = add ? append(id, selections) : selections.filter((id_) => id !== id_);
    return ([
      { path: ["ui", "aliens", "selections"], data }
    ])
  }
});

registerEvent({
  event: "inc-single-alien-age",
  paths: [["aliens"]],
  handler: ([aliens], id) => {
    const updatedAlien = { ...aliens[id], age: aliens[id].age + 1 };
    return [
      { path: ["aliens", id], data: updatedAlien }
    ]
  }
});

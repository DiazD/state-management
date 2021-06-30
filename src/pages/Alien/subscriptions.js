import { append, dissocPath } from "ramda";
import { registerEvent } from "../../jekyll";

registerEvent({
  event: "update-alien",
  handler: (_, data) => ([
    { path: ["aliens", data.id], data },
  ]),
});

registerEvent({
  event: "delete-alien",
  paths: [["aliens"]],
  handler: ({ aliens }, alienToRemove) => {
    return [
      { path: ["aliens"], data: dissocPath([alienToRemove], aliens) }
    ];
  }
})

registerEvent({
  event: "inc-alien-age",
  paths: [["aliens"], ["ui", "aliens", "selections"]],
  handler: ({ aliens, selections }) => ([
    {
      path: ["aliens"],
      data: selections.reduce((acc, id) => {
        const alien = { ...acc[id] };
        alien.age += 1;
        acc[id] = alien;

        return acc;
      }, aliens)
    }
  ])
});

registerEvent({
  event: "upcase-alien-name",
  paths: [["aliens"], ["ui", "aliens", "selections"]],
  handler: ({ aliens, selections }) => ([
    {
      path: ["aliens"],
      data: selections.reduce((acc, id) => {
        const alien = { ...acc[id] };

        // upcase first-name and last name then save
        alien.first_name = alien.first_name.toUpperCase();
        alien.last_name = alien.last_name.toUpperCase();
        acc[id] = alien;

        return acc;
      }, aliens)
    }
  ])
});

registerEvent({
  event: "ui-select-alien",
  paths: [["ui", "aliens", "selections"]],
  handler: ({ selections }, { id, add }) => {
    const data = add ? append(id, selections) : selections.filter((id_) => id !== id_);
    return ([
      { path: ["ui", "aliens", "selections"], data }
    ])
  }
});

registerEvent({
  event: "inc-single-alien-age",
  paths: [["aliens"]],
  handler: ({ aliens }, id) => {
    const updatedAlien = { ...aliens[id], age: aliens[id].age + 1 };
    return [
      { path: ["aliens", id], data: updatedAlien }
    ]
  }
});

registerEvent({
  event: "ui-set-alien-to-edit",
  paths: [["ui", "aliens", "aliensBeingEdited"]],
  handler: ({ aliensBeingEdited }, alienId) => ([
    { path: ["ui", "aliens", "aliensBeingEdited"], data: [...aliensBeingEdited, alienId] }
  ]),
});

registerEvent({
  event: "ui-update-alien-info",
  paths: [["aliens"], ["ui", "aliens", "aliensBeingEdited"]],
  handler: ({ aliens, aliensBeingEdited }, updatedAlien) => ([
    { path: ["aliens", updatedAlien.id], data: updatedAlien },
    {
      path: ["ui", "aliens", "aliensBeingEdited"],
      data: aliensBeingEdited.filter((id) => id !== updatedAlien.id)
    }
  ])
});

registerEvent({
  event: "ui-set-alien-to-view",
  handler: (_, alienId) => ([
    { path: ["ui", "aliens", "selectedAlien"], data: alienId }
  ])
});

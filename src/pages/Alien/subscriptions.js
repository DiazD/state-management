import { registerEvent } from "../../jekyll";
import { normalize } from "../../operators";

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
      data: normalize(
        Object.values(aliens).map((alien) => ({ ...alien, age: alien.age + 1 })),
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
      data: normalize(
        Object.values(aliens).map((alien) => ({
          ...alien,
          first_name: alien.first_name.toUpperCase(),
          last_name: alien.last_name.toUpperCase(),
        })),
      )
    }
  ])
});

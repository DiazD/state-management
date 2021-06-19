import { useRef } from "react";
import { Page } from "../../components";
import { useSubscription, dispatch } from "../../jekyll";
import "./Alien.css";
import { } from "./subscriptions";

const Checkbox = ({ id }) => {
  const isChecked = useSubscription(["ui", "aliens", "selections"], (selections) => selections.includes(id))
  const onChange = () => {
    dispatch(["ui-select-alien", { id: id, add: !isChecked }])
  }
  return <input type="checkbox" checked={isChecked} onChange={onChange} />;
};

const AlienDetails = ({ alien, isEditing }) => (
  <>
    <span className="card-column">{alien.first_name}</span>
    <span className="card-column">{alien.last_name}</span>
    <span className="card-column">{alien.email}</span>
    <span className="card-column">{alien.age}</span>
    <span className="card-column text-left">{alien.favorite_animal}</span>
    <span className="card-column">
      <button onClick={() => dispatch(["ui-set-alien-to-edit", alien.id])}>edit</button>
      <button>delete</button>
    </span>
  </>
);

const AlienForm = ({ alien }) => {
  const firstNameRef = useRef(alien.first_name);
  const lastNameRef = useRef(alien.last_name);
  const emailRef = useRef(alien.email);
  const ageRef = useRef(alien.age);
  const favoriteAnimalRef = useRef(alien.favorite_animal);

  const onSubmit = () => {
    const payload = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      email: emailRef.current.value,
      age: parseInt(ageRef.current.value),
      favorite_animal: favoriteAnimalRef.current.value,
    };

    dispatch(["ui-update-alien-info", { ...alien, ...payload }]);
  };

  return (
    <>
      <span className="card-column">
        <input ref={firstNameRef} name="first_name" defaultValue={alien.first_name} />
      </span>
      <span className="card-column">
        <input ref={lastNameRef} name="last_name" defaultValue={alien.last_name} />
      </span>
      <span className="card-column">
        <input ref={emailRef} name="email" defaultValue={alien.email} />
      </span>
      <span className="card-column">
        <input ref={ageRef} name="age" defaultValue={alien.age} />
      </span>
      <span className="card-column text-left">
        <input ref={favoriteAnimalRef} name="favorite_animal" defaultValue={alien.favorite_animal} />
      </span>
      <span className="card-column">
        <button onClick={onSubmit}>save</button>
        <button>cancel</button>
      </span>
    </>
  )
};

const AlienEditableDetails = ({ alien }) => {
  const isEditing = useSubscription(
    ["ui", "aliens", "aliensBeingEdited"],
    (aliensBeingEdited) => aliensBeingEdited.includes(alien.id)
  );
  return isEditing ? <AlienForm alien={alien} /> : <AlienDetails alien={alien} isEditing={isEditing} />;
};

const Alien = ({ id }) => {
  const [alien] = useSubscription(["aliens", id]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox id={id} />
      <div className="card">
        <span className="card-column text-left"><img alt="hello" src={alien.image} /></span>
        <AlienEditableDetails alien={alien} />
      </div>
    </div>
  );
}

const Aliens = ({ aliens }) => {
  return (
    <div className="card-container">
      {aliens.map((id) => <Alien key={id} id={id} />)}
    </div>
  );
};

const ControlPanel = () => {
  const incAge = () => dispatch(["inc-alien-age"]);
  const upcaseNames = () => dispatch(["upcase-alien-name"]);
  const incSingleAge = () => dispatch(["inc-single-alien-age", 1]);

  return (
    <div>
      <button onClick={incAge}>bulk inc age</button>
      <button onClick={upcaseNames}>upcase names</button>
      <button onClick={incSingleAge}>inc single age</button>
    </div>
  );
};

const AlienPage = () => {
  const aliens = useSubscription(["aliens"], (aliens) => Object.values(aliens).map(({ id }) => id));

  return (
    <Page title="Aliens">
      <ControlPanel />
      <Aliens aliens={aliens} />
    </Page>
  );
};

export default AlienPage;

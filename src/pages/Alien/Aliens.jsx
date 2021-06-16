import { Page } from "../../components";
import { useSubscription, dispatch } from "../../jekyll";
import "./Alien.css";
import { } from "./subscriptions";

const Checkbox = ({ id }) => {
  const isChecked = useSubscription(["ui", "aliens", "selections"], (selections) => selections.includes(id))
  const onChange = () => {
    dispatch(["ui-select-alien", { id: id, add: !isChecked }])
  }
  console.log("Who's RE-Rendering", id);
  return <input type="checkbox" checked={isChecked} onChange={onChange} />;
};

const Alien = ({ id }) => {
  const [alien] = useSubscription(["aliens", id]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox id={id} />
      <div className="card">
        <span className="card-column text-left"><img alt="hello" src={alien.image} /></span>
        <span className="card-column">{alien.first_name}</span>
        <span className="card-column">{alien.last_name}</span>
        <span className="card-column">{alien.email}</span>
        <span className="card-column">{alien.age}</span>
        <span className="card-column text-left">{alien.favorite_animal}</span>
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
  return (
    <div>
      <button onClick={incAge}>bulk inc age</button>
      <button onClick={upcaseNames}>upcase names</button>
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

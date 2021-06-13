import { Page } from "../../components";
import { useSubscription, dispatch } from "../../jekyll";
import "./Alien.css";
import { } from "./subscriptions";

const Alien = ({ alien }) => {
  return (
    <div className="card">
      <span className="card-column text-left"><img alt="hello" src={alien.image} /></span>
      <span className="card-column">{alien.first_name}</span>
      <span className="card-column">{alien.last_name}</span>
      <span className="card-column">{alien.email}</span>
      <span className="card-column">{alien.age}</span>
      <span className="card-column text-left">{alien.favorite_animal}</span>
    </div>
  );
}

const Aliens = ({ aliens }) => {
  return (
    <div className="card-container">
      {aliens.map((alien) => <Alien key={alien.id} alien={alien} />)}
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
  const aliens = useSubscription(["aliens"], (aliens) => Object.values(aliens));
  return (
    <Page title="Aliens">
      <ControlPanel />
      <Aliens aliens={aliens} />
    </Page>
  );
};

export default AlienPage;

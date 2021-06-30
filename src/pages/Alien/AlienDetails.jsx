import { useSubscription, dispatch } from "../../jekyll";
import "./AlienDetail.css";

const Header = ({ children }) => (
  <div className="header">
    <h4 className="header-title">{children}</h4>
    <button className="container-close-btn" onClick={() => dispatch(["ui-set-alien-to-view", null])}>X</button>
  </div>
)

const style = {
  textAlign: "left",
  backgroundColor: "lightgray",
  padding: "2rem",
  margin: "2rem",
  borderRadius: "20px",
  zIndex: 99999,
}

const Details = () => {
  const alien = useSubscription(
    [
      ["ui", "aliens", "selectedAlien"],
      ["aliens"]
    ],
    (selectedAlien, aliens) => aliens[selectedAlien]
  );
  return alien ? (
    <div>
      <div className="container">
        <Header>{alien.first_name}</Header>
        <div>
          <pre style={style}>
            <code>
              {JSON.stringify(alien, null, 2)}
            </code>
          </pre>
        </div>
      </div>
      <div className="backdrop"></div>
    </div>
  ) : null;
};

export default Details;

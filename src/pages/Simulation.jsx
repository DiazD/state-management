import "./Simulation.css";
import { useSubscription } from "../jekyll";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const Simulation = () => {
  return (
    <div className="">
      <Board />
    </div>
  );
};

export default Simulation;

const BoardContext = createContext();

const Board = () => {
  const boardRef = useRef();
  const [render, setRender] = useState();

  useEffect(() => {
    setTimeout(() => setRender(true), 300);
  }, []);

  return (
    <div ref={boardRef} className="board">
      <BoardContext.Provider value={{ ref: boardRef }}>
        {render && <EntityRenderer boardProps={{ ref: boardRef }} />}
      </BoardContext.Provider>
    </div>
  );
};

const EntityRenderer = () => {
  const entities = useSubscription(["entities"], (entities) => Object.keys(entities));

  return (
    <>
      {entities.map((id, idx) => (<Entity key={id} entityId={id} />))}
    </>
  )
};

const useAnimation = (frames) => {
  const ref = useRef();

  useEffect(() => {
    console.log("REFFF", ref);
  }, [ref])

  return { ref };
};

// entities
const toCssPosition = ({ x, y }) => ({ left: x, top: y });
const GreenBlock = ({ position, id, properties }) => {
  const { ref } = useAnimation();
  const pos = toCssPosition(position);
  const style = { ...pos, ...properties };
  return (<span ref={ref} style={style} className="bi box"></span>)
};

const entityRegistry = {
  "green-block": GreenBlock,
};

const Entity = ({ entityId }) => {
  const { ref } = useContext(BoardContext);
  const [entity] = useSubscription(["entities", entityId]);
  const { component, ...entityProps } = entity;

  // get component to render
  const Component = entityRegistry[component];

  // update position based off game-boards x/y offset
  const props = {
    ...entityProps,
    position: { x: entityProps.position.x, y: entityProps.position.y + ref.current.offsetTop }
  };

  return <Component {...props} />;
};

import { useState } from "react";
import { Search as SearchInput } from "semantic-ui-react";

import "./StatePage.css";
import { delay, getPaths, getIn, isObject, all } from "../../operators";
import { useSubscription, dispatch } from "../../jekyll";
import "./events";

const Search = () => {
  const paths = useSubscription(
    [],
    (state) => getPaths(state, [], [])
      .map((path) => ({
        title: `${path.split(",").join(" > ")}`, value: path
      }))
  );
  const [inputValue, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e, data) => {
    setLoading(true);
    setValue(data.value);

    delay(() => {
      setSuggestions(paths.filter(({ value }) => all(data.value.split(" ").map((token) => value.includes(token)))));
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (_, data) => {
    dispatch(["ui-state-set-paths-to-view", data.result]);
  };

  return (
    <div className="search-container" >
      <SearchInput
        className="search-list"
        minCharacters={2}
        loading={loading}
        onResultSelect={handleSearch}
        onSearchChange={handleSearchChange}
        results={suggestions}
        value={inputValue}
      />
    </div >
  );
};

const Dropdown = ({ visible, children }) => {
  return (
    <div className={visible ? "show" : "no-show"}>
      {children}
    </div>
  );
};

const RenderTree = ({ value }) => {
  return <>
    {"{"}
    {Object.entries(value).map(([key, value], idx) => (
      <div style={{ marginLeft: "10px" }} key={idx}>
        <StateSlice heading={key} value={value} />
      </div>
    ))}
    {"}"}
  </>
};

const InlinedKeyValue = ({ heading, value }) => (
  <span className="state-slice-path-heading">
    <span className="keyword">{heading}</span>: {" "}
    <span className="value">{value === undefined || value === null ? "null" : value}</span>
  </span>
);

const KeyValueDropdown = ({ heading, value }) => {
  const [visible, setVisibility] = useState(false);

  return (
    <>
      <span
        onClick={() => setVisibility(state => !state)}
        className="state-slice-path-heading pointer"
      >
        <span className="dropdown-arrow">
          {!visible ? "\uFFEB" : "\uFFEC "}
        </span>
        <span className="keyword">{heading}</span>:
      </span>
      <Dropdown visible={visible}>
        <div className="state-slice-path-data">
          <RenderTree value={value} />
        </div>
      </Dropdown>
    </>
  );
};

const StateSlice = ({ heading, value }) => {
  return (
    <div className="state-slice-wrapper">
      {
        isObject(value) || Array.isArray(value) ? (
          <KeyValueDropdown heading={heading} value={value} />
        ) : (
          <InlinedKeyValue heading={heading} value={value} />
        )
      }
    </div>
  );
};

const ConstateSlice = ({ heading }) => {
  const [value] = useSubscription(heading.split(" > "));
  return <StateSlice heading={heading} value={value} />;
};

const DataView = () => {
  const selectedSlices = useSubscription(
    [
      ["ui", "state", "viewedPaths"],
      [],
    ],
    (results, state) => {
      return results.map(({ title, value }) => ({ heading: title, value: getIn(value, state) }));
    }
  );

  return (
    <div className="data-view-container">
      {selectedSlices.map(({ heading, value }, idx) => (
        <ConstateSlice key={idx} heading={heading} value={value} />
      ))}
    </div>
  );
}

const StatePage = () => {
  const [show] = useSubscription(["ui", "state", "showStateTree"]);
  const showStateTree = () => dispatch(["ui-state-show-tree", !show]);

  return (
    <div>
      <button onClick={showStateTree}>show state tree</button>
      {show ? (
        <div className="state-container">
          <button onClick={showStateTree}>Close</button>
          <Search />
          <DataView />
        </div>
      ) : null}
    </div>
  )
};

export default StatePage;

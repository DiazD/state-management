import { useRef } from "react";
import { dispatch } from "../../jekyll";
import { getIn } from "../../operators";

const Search = () => {
  const inputRef = useRef();

  const doSearch = () => {
    dispatch(["ui-search-aliens", getIn(["current", "value"], inputRef, "")]);
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Search" />
      <button onClick={doSearch}>search(case senstive)</button>
    </div>
  );
};

const sortingOptions = [
  { label: "Name (ASC)", value: { attr: "first_name", type: "asc", dataType: "string" } },
  { label: "Name (DESC)", value: { attr: "first_name", type: "desc", dataType: "string" } },
  { label: "Last Name (ASC)", value: { attr: "last_name", type: "asc", dataType: "string" } },
  { label: "Last Name (DESC)", value: { attr: "last_name", type: "desc", dataType: "string" } },
  { label: "Age (ASC)", value: { attr: "age", type: "asc", dataType: "number" } },
  { label: "Age (DESC)", value: { attr: "age", type: "desc", dataType: "number" } },
  { label: "Email (ASC)", value: { attr: "email", type: "asc", dataType: "string" } },
  { label: "Email (DESC)", value: { attr: "email", type: "desc", dataType: "string" } },
];

const Sort = () => {
  const onSelectChange = (e) => {
    const { target: { value } } = e;
    dispatch(["ui-aliens-sort", sortingOptions[parseInt(value)].value]);
  };

  return (
    <select onChange={onSelectChange}>
      <option default>--Select sort option--</option>
      { sortingOptions.map(({ label }, idx) => (
        <option key={label} value={idx}>{label}</option>
      ))}
    </select>
  );
}

const ControlPanel = () => {
  const incAge = () => dispatch(["inc-alien-age"]);
  const upcaseNames = () => dispatch(["upcase-alien-name"]);

  return (
    <div className="control-panel">
      <button onClick={incAge}>bulk inc age</button>
      <button onClick={upcaseNames}>upcase names</button>
      <Search />
      <Sort />
    </div>
  );
};

export default ControlPanel;

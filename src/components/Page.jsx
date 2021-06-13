import "./Page.css";

const Page = ({ title, children }) => (
  <div className="page__container">
    <h2>{title}</h2>
    {children}
  </div>
);

export default Page;

import { Page } from "../../components";
import { } from "./events";
import Details from "./AlienDetails";
import ControlPanel from "./ControlPanel";
import Aliens from "./AliensList";

const AlienPage = () => {
  return (
    <Page title="Aliens">
      <ControlPanel />
      <Details />
      <Aliens />
    </Page>
  );
};

export default AlienPage;

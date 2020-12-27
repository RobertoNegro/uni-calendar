import "./loader.styles.css";
import Spinner from "../spinner/spinner.component";

const Loader = ({ show }: { show?: boolean }) => (
  <div className={`overlay ${show ? "" : "overlay-hide"}`}>
    <Spinner />
  </div>
);

export default Loader;

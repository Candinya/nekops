import { Link } from "react-router-dom";

const Home = () => (
  <div>
    Home
    <Link to={"/auth"}>Auth</Link>
    <Link to={"/dashboard"}>Dashboard</Link>
    <Link to={"/settings"}>Settings</Link>
  </div>
);

export default Home;

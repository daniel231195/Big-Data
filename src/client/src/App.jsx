import styled from "styled-components";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Search from "./pages/Search";

function App() {
  return (
    <AppWrapper>
      <SideNavbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </AppWrapper>
  );
}

export const AppWrapper = styled.div`
  display: flex;
  background: #3c445a;
  height: 100vh;
`;

export default App;

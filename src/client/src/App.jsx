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
      <AppBody className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </AppBody>
    </AppWrapper>
  );
}

export const AppWrapper = styled.div`
  display: flex;
  background: #3c445a;
  height: 100vh;
`;

const AppBody = styled.div`
  display: flex;
  width: 100%;
`;

export default App;

import styled from "styled-components";
import SideNavbar from "./components/SideNavbar/SideNavbar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import Search from "./pages/Search";
import { useEffect } from "react";
import { getAssociation } from "./Utils/apiUtils";
import { useState } from "react";


function App() {
  const [association, setAssociation] = useState();

  useEffect(() => {
    document.title = 'Ordering Pizza App';
    getAssociation().then((res) => {
      setAssociation(res.data);
    })
  }, []);

  return (
    <AppWrapper>
      <SideNavbar />
      <AppBody className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/analyze" element={<Analyze association={association} />} />
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

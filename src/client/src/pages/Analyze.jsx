import { useState } from "react";
import styled from "styled-components";
import { d } from "../assets/const";
import Table from "../components/Table/Table";
import { getAssociation } from "../Utils/apiUtils";
import { assoc } from "../Utils/localUtils";
import {
  BranchInput,
  Date,
  SearchButton,
  SearchField,
  SectionLabel,
} from "./Search";

const Analyze = () => {
  const [association, setAssociation] = useState(d);
  const headers = ["antecedent", "consequent", "support(%)", "confidence(%)"];



  const modelButtonHandler = () => {
    getAssociation();
    setAssociation(assoc(d, d.length - Math.floor(Math.random() * d.length)));
  }

  return (
    <AnalyzeWrapper>
      <SearchField>
        <SectionLabel>From Date</SectionLabel>
        <Date />
        <SectionLabel>To Date</SectionLabel>
        <Date />
        <SearchButton onClick={modelButtonHandler}>Create Model</SearchButton>
      </SearchField>
      <Table headers={headers} data={association} />
    </AnalyzeWrapper>
  );
};

const AnalyzeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: "Open Sans";
  margin-top: 100px;
  gap: 50px;
`;

export default Analyze;

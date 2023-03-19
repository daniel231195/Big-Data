import styled from "styled-components";
import Table from "../components/Table/Table";
import {
  BranchInput,
  Date,
  SearchButton,
  SearchField,
  SectionLabel,
} from "./Search";

const Analyze = (props) => {
  const { association } = props;
  const headers = ["antecedent", "consequent", "support(%)", "confidence(%)"];

  return (
    <AnalyzeWrapper>
      <SearchField>
        <SectionLabel>From Date</SectionLabel>
        <Date />
        <SectionLabel>To Date</SectionLabel>
        <Date />
        <SearchButton>Create Model</SearchButton>
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

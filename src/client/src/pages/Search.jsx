import styled from "styled-components";
import Table from "../components/Table/Table";

const Search = () => {



  return (
    <SearchPageContainer>
      <SearchField>
        <SectionLabel>Branch</SectionLabel>
        <BranchInput placeholder="Search branch..." />
        <SectionLabel>Date</SectionLabel>
        <Date />
        <SearchButton>Search</SearchButton>
      </SearchField>
      <Table  />
    </SearchPageContainer>
  );
};

export const SearchPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: "Open Sans";
  margin-top: 100px;
  gap: 50px;
`;

export const SearchField = styled.div`
  display: flex;
  width: fit-content;
  gap: 10px;
  align-items: center;
`;

export const SectionLabel = styled.div`
  height: fit-content;
  background: grey;
  border: 1px solid black;
  border-radius: 5px;
  padding: 0 4px 0 4px;
  font-weight: 500;
  color: whitesmoke;
`;

export const BranchInput = styled.input`
  height: 30px;
  font-family: "Open Sans";
  font-weight: 500;
  background: #36404a;
  color: #8c98a5;
  border-radius: 4px;
  border: 1px solid transparent;
  padding-left: 10px;
  cursor: pointer;
`;

export const Date = styled.input.attrs({ type: "date" })`
  height: 30px;
  font-family: "Open Sans";
  font-weight: 500;
  text-align: center;
  background: #36404a;
  color: #8c98a5;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
`;

export const SearchButton = styled.button`
  font-weight: 500;
  background: grey;
  border-radius: 4px;
  border: 1px solid transparent;
  height: 25px;
  cursor: pointer;
`;
export default Search;

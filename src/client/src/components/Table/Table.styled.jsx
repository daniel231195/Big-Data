import styled from "styled-components";

const SCROLLBAR_WIDTH = 14;

export const TableStyled = styled.table`
  display: block;
  height: 327px;
  overflow-y: hidden;
  &&:hover {
    overflow-y: scroll;
  }

  ::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
    background: white;
    height: 328px;
  }
  ::-webkit-scrollbar-button {
    display: none;
    background: white;
  }
  ::-webkit-scrollbar-track {
    background: white;
  }
  ::-webkit-scrollbar-thumb {
     background: grey;
    border-radius: 100px;
`;

export const RowCell = styled.td`
  text-align: center;
`;

export const Row = styled.tr`
    gap: 5px;
`

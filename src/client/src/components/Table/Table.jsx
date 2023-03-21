import { useEffect } from "react";
import { Row, RowCell, TableStyled } from "./Table.styled";

const Table = (props) => {
  const { headers, data } = props;

  const renderBody = () => {
    return (
      data &&
      data.map(({ antecedent, consequent, support, confidence }, index) => {
        return (
          <Row key={`row ${index}`}>
            <RowCell>{antecedent}</RowCell>
            <RowCell>{consequent}</RowCell>
            <RowCell>{parseFloat(support.slice(0, -1)).toFixed(2)}</RowCell>
            <RowCell>{parseFloat(confidence.slice(0, -1)).toFixed(2)}</RowCell>
          </Row>
        );
      })
    );
  };

  useEffect(() => {}, [data]);

  return (
    <TableStyled>
      <thead>
        <Row>
          {headers && headers.map((header) => <th key={header}>{header}</th>)}
        </Row>
      </thead>
      {renderBody()}
    </TableStyled>
  );
};
export default Table;

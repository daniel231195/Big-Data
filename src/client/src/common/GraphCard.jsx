import styled from "styled-components";
import ProgressBar from "../components/ProgressBar";

const GraphCard = ({ header, value, icon, data, ...props }) => {
  return (
    <GraphCardWrapper>
      {icon}
      <GraphCardDescription>{header}</GraphCardDescription>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div>{key.split("").reverse().join("")}</div>
          <ProgressBar done={value}/>
        </div>
    
      ))}
    </GraphCardWrapper>
  );
};

export default GraphCard;

export const GraphCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: fit-content;
  height: fit-content;
  padding: 1em 3em 2em 3em;
  margin: 0em auto;
  background-color: #fff;
  border-radius: 4.2px;
  box-shadow: 0px 3px 10px -2px rgba(0, 0, 0, 0.2);
  gap: 20px;
`;

export const GraphCardDescription = styled.span`
  color: #b9b9b9;
`;

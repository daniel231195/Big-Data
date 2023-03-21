import { useEffect, useState } from "react";
import styled from "styled-components";
import VerticalBarChart from "../components/VerticalBarChart";

const GraphCard = ({ header, value, icon, ...props }) => {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if(props.data){
      // console.log(props.data)
      const transformedData = Object.entries(props.data).map(([name, value]) => ({ name: name.split("").reverse().join(""), value: value/10 }));
      setData(transformedData)
    }
  }, [props.data])


  return (
    <GraphCardWrapper>
      {icon}
      <GraphCardDescription>{header}</GraphCardDescription>
      <VerticalBarChart data={data} />
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

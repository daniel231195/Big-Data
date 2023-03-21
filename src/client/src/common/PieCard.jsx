import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import styled from "styled-components";

const PieCard = ({ header, value, icon, data, labels, pieData, ...props }) => {

    const pieInfo = {
        labels: labels? labels.map((el) => el.split("").reverse().join("") ) : '',
        datasets: [
          {
            data: pieData,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", '#457b9d', '#faedcd'],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", '#457b9d', '#faedcd'],
          },
        ],
      };

  return (
    <PieCardWrapper>
      {icon}
      <PieCardDescription>{header}</PieCardDescription>
        <div>{data}</div>
        <Pie data={pieInfo} />
    </PieCardWrapper>
  );
};

export default PieCard;

export const PieCardWrapper = styled.div`
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

export const PieCardDescription = styled.span`
  color: #b9b9b9;
`;

import styled from "styled-components";

const SimpleCard = ({ header, value, icon, data, ...props }) => {
  return (
    <CardWrapper>
      {icon}
      <CardDescription>{header}</CardDescription>
        <div>{data}</div>
    </CardWrapper>
  );
};

export default SimpleCard;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: fit-content;
  height: fit-content;
  padding: 1em 3em 2em 3em;
  margin: 0em auto;
  background-color: #fff;
  align-items: center;
  border-radius: 4.2px;
  box-shadow: 0px 3px 10px -2px rgba(0, 0, 0, 0.2);
  gap: 20px;
`;

export const CardDescription = styled.span`
  color: #b9b9b9;
`;

import styled from "styled-components";

const Card = ({ header, value, icon, ...props }) => {
    return (
        <CardWrapper>
            {icon}
            <CardDescription>{header}</CardDescription>
        </CardWrapper>
    )
}

export default Card;

export const CardWrapper = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  padding: 1em 3em 2em 3em;
  margin: 0em auto;
  background-color: #fff;
  border-radius: 4.2px;
  box-shadow: 0px 3px 10px -2px rgba(0, 0, 0, 0.2);
  gap: 20px;
`;

export const CardDescription = styled.span`
 color: #b9b9b9;
`;
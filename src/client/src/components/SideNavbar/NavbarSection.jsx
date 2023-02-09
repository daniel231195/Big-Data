import { Link } from "react-router-dom";
import styled from "styled-components";

const NavbarSection = ({ icon, title, margin, ...props }) => {
  return (
    <Link to={props.path}  style={{ textDecoration: 'none' }}>
      <SectionWrapper {...{ margin }}>
        {icon ? icon : ""}
        <SectionTitle>{title}</SectionTitle>
      </SectionWrapper>
    </Link>
  );
};

const SectionWrapper = styled.button`
  display: flex;
  gap: 10px;
  border: 1px solid transparent;
  background: transparent;
  align-items: center;
  margin: ${({ margin }) => (margin ? margin : "0 0 0 0")};
  cursor: pointer;
`;

const SectionTitle = styled.span`
  display: flex;
  color: white;
  align-items: center;
  font-family: "Open Sans";
  font-size: 20px;
  font-weight: 600;
`;
export default NavbarSection;

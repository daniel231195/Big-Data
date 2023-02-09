import styled from "styled-components";

export const SideNavbarContainer = styled.nav`
  display: flex;
  width: 250px;
  justify-content: center;
  align-items: center;
  background: rgb(17, 24, 39);
`;

export const SideNavbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 95%;
  align-items: center;
`;

export const SideNavbarHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
`;

export const MenuBtnWrapper = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  margin-top: 10px;
`;

export const MenuBtn = styled.button`
  display: flex;
  border: 1px solid transparent;
  background: transparent;
  width: fit-content;
  align-items: center;
  cursor: pointer;
`;

export const NavbarSectionWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  gap: 20px;
  align-self: flex-start;
`;

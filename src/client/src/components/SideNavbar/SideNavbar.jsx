import AnalyticsIcon from "../../assets/icons/AnalyticsIcon";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import MenuIcon from "../../assets/icons/MenuIcon";
import PizzaIcon from "../../assets/icons/PizzaIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import StyledText from "../../common/StyledText";
import NavbarSection from "./NavbarSection";
import {
  MenuBtn,
  NavbarSectionWrapper,
  SideNavbarContainer,
  SideNavbarHeader,
  SideNavbarWrapper,
} from "./NavbarSection.styled";

const SideNavbar = () => {
  return (
    <SideNavbarContainer>
      <SideNavbarWrapper>
        <SideNavbarHeader>
          <PizzaIcon />
          <StyledText text="My Pizza Data" color="#919AA4" />
          <MenuBtn>
            <MenuIcon />
          </MenuBtn>
        </SideNavbarHeader>
        <NavbarSectionWrapper>
          <NavbarSection title="Dashboard" icon={<DashboardIcon />} path="/" />
          <NavbarSection
            title="Analyze"
            icon={<AnalyticsIcon />}
            path="/analyze"
          />
          <NavbarSection title="Search" icon={<SearchIcon />} path="/search" />
        </NavbarSectionWrapper>
      </SideNavbarWrapper>
    </SideNavbarContainer>
  );
};

export default SideNavbar;

import CartIcon from "../assets/icons/CartIcon";
import HourglassIcon from "../assets/icons/HourglassIcon";
import MenuBoardIcon from "../assets/icons/MenuBoardIcon";
import MotorcycleIcon from "../assets/icons/MotorcycleIcon";
import Card from "../components/common/Card";
import { DashboardCardsWrapper, DashboardWrapper } from "./Dashboard.styled";

const Dashboard = () => {
  const totalOrders = 'Total orders today: ';
  const openOrders = 'Total open orders: ';
  const averageTime = 'Average order treatment time: ';
  const openedBranches = 'Opened branches: ';
  const areaDistribution = 'Orders distributions per area: ';
  const topTreatment = '5 Top branches with fastest treatment: ';
  const topToppings = '5 Top ordered toppings: ';
  const generalOrders = 'General orders throughout the day: ';

  return (
    <DashboardWrapper>
      <DashboardCardsWrapper>
        <Card header={openedBranches} icon={<CartIcon />} />
        <Card header={averageTime} icon={<HourglassIcon />} />
        <Card header={openOrders} icon={<MotorcycleIcon />} />
        <Card header={totalOrders} icon={<MenuBoardIcon />} />
      </DashboardCardsWrapper>
      <DashboardCardsWrapper>       <Card header={topToppings} />
        <Card header={topTreatment} />
        <Card header={areaDistribution} /></DashboardCardsWrapper>
      <DashboardCardsWrapper>
        <Card header={generalOrders} /></DashboardCardsWrapper>
    </DashboardWrapper>
  )
};

export default Dashboard;

import { useState } from "react";
import CartIcon from "../assets/icons/CartIcon";
import HourglassIcon from "../assets/icons/HourglassIcon";
import MenuBoardIcon from "../assets/icons/MenuBoardIcon";
import MotorcycleIcon from "../assets/icons/MotorcycleIcon";
import GraphCard from "../common/GraphCard";
import PieCard from "../common/PieCard";
import SimpleCard from "../common/SimpleCard";
import PieChart from "../components/PieChart";
import { socket } from "../Utils/socket";
import { DashboardCardsWrapper, DashboardWrapper } from "./Dashboard.styled";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const totalOrders = "Total orders today: ";
  const openOrders = "Total open orders: ";
  const averageTime = "Average order treatment time (in minutes): ";
  const openedBranches = "Opened branches: ";
  const areaDistribution = "Orders distributions per area: ";
  const topTreatment = "5 Top branches with fastest treatment: ";
  const topToppings = "5 Top ordered toppings: ";
  const generalOrders = "General orders throughout the day: ";

  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("updated-orders", (message) => {
    setData(message);
    console.log(message);
  });

  return (
    <DashboardWrapper>
      <DashboardCardsWrapper>
        <SimpleCard
          header={openedBranches}
          icon={<CartIcon />}
          data={data.open_branches ? data.open_branches : ""}
        />
        <SimpleCard
          header={averageTime}
          icon={<HourglassIcon />}
          data={
            data.average_delivered_time
              ? parseFloat(data.average_delivered_time).toFixed(2)
              : ""
          }
        />
        <SimpleCard
          header={openOrders}
          icon={<MotorcycleIcon />}
          data={data.total_open_orders ? data.total_open_orders : ""}
        />
        <SimpleCard
          header={totalOrders}
          icon={<MenuBoardIcon />}
          data={data.total_orders ? data.total_orders : ""}
        />
      </DashboardCardsWrapper>
      <DashboardCardsWrapper>
        {" "}
        <GraphCard
          header={topToppings}
          data={data.top5Topping ? data.top5Topping : ""}
        />
        <GraphCard
          header={topTreatment}
          data={data.top5CarryBranches ? data.top5CarryBranches : ""}
        />{" "}
        <PieCard
          header={areaDistribution}
          pieData={
            data.orders_by_districts
              ? Object.keys(data.orders_by_districts)
              : ""
          }
          labels={
            data.orders_by_districts
              ? Object.values(data.orders_by_districts)
              : ""
          }
        />{" "}
      </DashboardCardsWrapper>
      <DashboardCardsWrapper>
        <SimpleCard header={generalOrders} />
      </DashboardCardsWrapper>
    </DashboardWrapper>
  );
};

export default Dashboard;

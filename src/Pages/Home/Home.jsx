import React from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/Sidebar";
import Counts from "./comps/Counts";
import SalesChart from "./comps/salesChart";
import TodaysEvents from "./comps/todayEvents";

function Home() {
  return (
    <>
      <div className="container-scroller">
        <Sidebar />
        <div className="container-fluid">
          <Header />
          <div className="main-panel">
            <div className="content-wrapper">
              <Counts />
              <SalesChart />
              <TodaysEvents />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

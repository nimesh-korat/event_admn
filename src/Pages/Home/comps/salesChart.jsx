import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart,
  LineElement,
  ArcElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
  Legend,
  Title,
  Tooltip,
  Filler,
} from "chart.js/auto";
Chart.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  Tooltip,
  Filler
);
function SalesChart() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [count, setCount] = useState({
    totalBooking: 0,
    totalProfit: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  function formateDate(dates) {
    const date = new Date(dates);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0` + day : day;
    const formattedMonth = month < 10 ? `0` + month : month;

    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    return formattedDate;
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getDailyProfit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data.dailyProfit;
      setCount({
        totalBooking: response.data.totalBooking,
        totalProfit: response.data.totalProfit,
      });
      const sales = data.map((obj) => parseInt(obj.sales));
      const date = data.map((obj) => formateDate(obj.date));

      console.log(date, sales);

      setChartData({
        labels: date,
        datasets: [
          {
            label: "Profit",
            data: sales,
            fill: true,
            tension: 0.15,
          },
        ],
      });

      setIsLoaded(true);
    } catch (error) {
      console.log("Fetch Categories Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <div className="card-title mb-0">Sales Chart</div>
                </div>
                <div>
                  <div className="d-flex flex-wrap pt-2 justify-content-between sales-header-right">
                    <div className="d-flex justify-content-center align-items-center mr-5">
                      <button
                        type="button"
                        className="btn btn-social-icon btn-outline-sales"
                      >
                        <i className="mdi mdi-inbox-arrow-down" />
                      </button>
                      <div className="pl-2 text-center">
                        <h4 className="mb-0 font-weight-semibold head-count">
                          {count.totalBooking}
                        </h4>
                        <span className="font-10 font-weight-semibold text-muted">
                          TOTAL Booking
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                      <button
                        type="button"
                        className="btn btn-social-icon btn-outline-sales profit"
                      >
                        <i className="mdi mdi-cash text-info" />
                      </button>
                      <div className="pl-2">
                        <h4 className="mb-0 font-weight-semibold head-count">
                          RS. {count.totalProfit}
                        </h4>
                        <span className="font-10 font-weight-semibold text-muted">
                          TOTAL PROFIT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flot-chart-wrapper">
                {!isLoaded ? (
                  <p>Loading...</p>
                ) : chartData.datasets.length === 0 ? (
                  <p className="text-center">No Data Found</p>
                ) : (
                  <Line
                    className="flot-base"
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        title: {
                          display: true,
                          text: "Daily Sales",
                        },
                        tooltip: {
                          enabled: true,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalesChart;

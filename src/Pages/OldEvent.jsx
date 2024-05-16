import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { CDBDataTable } from "cdbreact";

function OldEvent() {
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getPastEvents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const datas = await response.json();
      setData(datas?.pastEvents ?? []);
    } catch (error) {
      setData([]);
      console.log("Fetch Past Events Error:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  console.log(data);
  var formattedData = [];
  if (data?.length > 0) {
    formattedData = data
      ?.map((data) => ({
        eventId: data?._id,
        eventName: data?.eventName,
        category: data?.category,
        pricePerSeat: data?.pricePerSeat,
        totalSeats: data?.totalSeats,
        date: new Date(data?.datetime).toLocaleDateString(),
        time: new Date(data?.datetime).toLocaleTimeString(),
        totalBookedSeats: data?.totalBookedSeats,
      }))
      .reverse();
  }

  return (
    <>
      <div className="container-scroller">
        <Sidebar />
        <div className="container-fluid page-body-wrapper">
          <Header />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title"> Done Event Table</h4>
                      <div className="table-responsive">
                        {!isLoaded ? (
                          <div>Loading...</div>
                        ) : (
                          <CDBDataTable
                            striped
                            hover
                            responsive
                            entriesOptions={[5, 20, 25]}
                            entries={5}
                            pagesAmount={4}
                            data={{
                              columns: [
                                { label: "Event ID", field: "eventId" },
                                { label: "Event Name", field: "eventName" },
                                { label: "Category", field: "category" },
                                { label: "Price", field: "pricePerSeat" },
                                { label: "Total Seats", field: "totalSeats" },
                                { label: "Booked", field: "totalBookedSeats" },
                                { label: "Date", field: "date" },
                                { label: "Time", field: "time" },
                              ],
                              rows: formattedData,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OldEvent;

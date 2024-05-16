import React, { useEffect } from "react";
import { CDBDataTable } from "cdbreact";

function TodaysEvents() {
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getTodaysEvents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const datas = await response.json();
      setData(datas.todayEvents.reverse());
    } catch (error) {
      setData([]);
      console.log("Fetch Today's Events Error:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  var formattedData = [];
  if (data.length > 0) {
    formattedData = data?.map((data) => ({
      eventId: data._id,
      eventName: data.eventName,
      category: data.category,
      pricePerSeat: data.pricePerSeat,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      address: data.address,
      // date: new Date(data.datetime).toLocaleDateString(),
      time: new Date(data.datetime).toLocaleTimeString(),
    }));
  }

  return (
    <>
      <div className="row mt-4">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <div className="card-title mb-2">Today's Events</div>
              <div className="table-responsive p-2">
                {!isLoaded ? (
                  <div>Loading...</div>
                ) : (
                  <CDBDataTable
                    striped
                    hover
                    responsive
                    entriesOptions={[5, 20, 25]}
                    entries={5}
                    noRecordsFoundLabel="No events found"
                    pagesAmount={4}
                    data={{
                      columns: [
                        { label: "Event ID", field: "eventId" },
                        { label: "Event Name", field: "eventName" },
                        { label: "Category", field: "category" },
                        { label: "Price", field: "pricePerSeat" },
                        { label: "Total Seats", field: "totalSeats" },
                        { label: "Available Seats", field: "availableSeats" },
                        { label: "Address", field: "address" },
                        // { label: "Date", field: "date" },
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
    </>
  );
}

export default TodaysEvents;

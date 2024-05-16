import React, { useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { CDBDataTable } from "cdbreact";

function Complain() {
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getComplaint`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const datas = await response.json();
      setData(datas?.complaint ?? []);
    } catch (error) {
      setData([]);
      console.log("Fetch Complaint Error:", error);
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
        artistId: data?.artistId,
        userId: data?.userId,
        subject: (
          <textarea
            className="form-control"
            value={data?.subject}
            cols={10}
            readOnly
          />
        ),
        messages: (
          <textarea
            className="form-control"
            value={data?.message}
            cols={10}
            readOnly
          />
        ),
        status: data?.status,
        date: new Date(data?.timestamp).toLocaleDateString(),
        time: new Date(data?.timestamp).toLocaleTimeString(),
      }))
      .reverse();
  }

  return (
    <>
      <div className="container-scroller">
        <Sidebar />
        <div className="container-fluid page-body-wrapper">
          <Header />
          {/* partial */}
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title">Complaint Table</h4>
                      <div className="table-responsive">
                        {!isLoaded ? (
                          <div>Loading...</div>
                        ) : data?.length === 0 ? (
                          <div>No data found</div>
                        ) : (
                          <CDBDataTable
                            striped
                            hover
                            noRecordsFoundLabel="No Records Found"
                            responsive
                            entriesOptions={[5, 20, 25]}
                            entries={5}
                            pagesAmount={4}
                            data={{
                              columns: [
                                { label: "Artist ID", field: "artistId" },
                                { label: "User ID", field: "userId" },
                                { label: "Subject", field: "subject" },
                                { label: "Message", field: "messages" },
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

export default Complain;

import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { CDBDataTable } from "cdbreact";

function Artist() {
  const [datas, setDatas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getArtist`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const datas = await response.json();
      setDatas(datas?.artists ?? []);
    } catch (error) {
      setDatas([]);
      console.log("Fetch Artist Error:", error);
    } finally {
      setIsLoaded(true);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  console.log(datas);
  var formattedData = [];
  if (datas?.length > 0) {
    formattedData = datas?.map((data) => ({
      ID: data?._id,
      Name: data?.name,
      Experiance: data?.experiance + " years",
      Category: data?.category,
      Email: data?.email,
      profilePic: (
        <img
          src={`${process.env.REACT_APP_MONGO_BASE_URL}/images/profilePics/${data?.profilePic}`}
          alt="profileImge"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    }));
  }

  const renderImageCell = (value) => (
    <img
      src={value}
      alt="profileImg"
      style={{ width: "50px", height: "50px" }}
    />
  );

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
                      <h4 className="card-title">Artist Table</h4>
                      {!isLoaded ? (
                        <div>Loading...</div>
                      ) : datas?.length === 0 ? (
                        <div>No data found</div>
                      ) : (
                        <CDBDataTable
                          className="CDBDataTable"
                          striped
                          hover
                          responsive
                          entriesOptions={[5, 20, 25]}
                          entries={5}
                          pagesAmount={4}
                          data={{
                            columns: [
                              {
                                label: "Profile Pic",
                                field: "profilePic",
                                filter: false,
                                render: renderImageCell,
                              },
                              { label: "User ID", field: "ID" },
                              { label: "Name", field: "Name" },
                              { label: "Experiance", field: "Experiance" },
                              { label: "Category", field: "Category" },
                              { label: "Email", field: "Email" },
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
    </>
  );
}

export default Artist;

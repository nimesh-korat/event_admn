import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { CDBDataTable } from "cdbreact";

function Users() {
  const [datas, setDatas] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchDatas = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getUser`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const datas = await response.json();
      setDatas(datas?.users ?? []);
    } catch (error) {
      setDatas([]);
      console.log("Fetch User Error:", error);
    } finally {
      setIsLoaded(true);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchDatas();
  }, []);

  var formattedData = [];
  if (datas.length > 0) {
    formattedData = datas?.map((data) => ({
      ID: data?._id,
      Name: data?.name,
      Email: data?.email,
      Address: data?.address,
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
                      <h4 className="card-title">User Table</h4>
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
                                {
                                  label: "Profile Pic",
                                  field: "profilePic",
                                  filter: false,
                                  render: renderImageCell,
                                },
                                { label: "User ID", field: "ID" },
                                { label: "Name", field: "Name" },
                                { label: "Email", field: "Email" },
                                { label: "Address", field: "Address" },
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

export default Users;

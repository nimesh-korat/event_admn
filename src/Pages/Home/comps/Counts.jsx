import React, { useEffect } from "react";

function Counts() {
  const [counts, setCounts] = React.useState({});

  const fetchCounts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getCounts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setCounts(data.counts);
    } catch (error) {
      console.error(error);
      setCounts({});
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex flex-wrap justify-content-between">
              <div>
                <h4 className="font-weight-semibold mb-1 text-black">
                  Total Users
                </h4>
                <h6 className="text-muted">User Counts</h6>
              </div>
              <h3 className="text-success font-weight-bold">
                {counts?.userCount ? counts?.userCount : 0}
              </h3>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex flex-wrap justify-content-between">
              <div>
                <h4 className="font-weight-semibold mb-1 text-black">
                  Total Artists
                </h4>
                <h6 className="text-muted">Artist Counts</h6>
              </div>
              <h3 className="text-success font-weight-bold">
                {counts?.artistCount ? counts?.artistCount : 0}
              </h3>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card h-100">
            <div className="card-body d-flex flex-wrap justify-content-between">
              <div>
                <h4 className="font-weight-semibold mb-1 text-black">
                  Total Complain
                </h4>
                <h6 className="text-muted">Complain about Event</h6>
              </div>
              <h3 className="text-danger font-weight-bold">
                {counts?.complaintCount ? counts?.complaintCount : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Counts;

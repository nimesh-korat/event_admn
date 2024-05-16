import React, { useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { CDBDataTable } from "cdbreact";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Payment() {
  const [data, setData] = React.useState([]);
  //eslint-disable-next-line
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const tableRef = useRef();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MONGO_BASE_URL}/admin/getPayment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const datas = await response.json();
      setData(datas?.payments ?? []);
    } catch (error) {
      setData([]);
      console.log("Fetch Payment Error:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
    fetchData();
  }, []);

  var formattedData = [];
  if (data?.length > 0) {
    formattedData = data
      ?.map((data) => ({
        paymentId: data?._id,
        bookingId: data?.bookingId,
        payments: data?.payments,
        status: data?.status,
        date: new Date(data?.date).toLocaleDateString(),
        time: new Date(data?.date).toLocaleTimeString(),
      }))
      .reverse();
  }

  const handleGenerateReport = () => {
    let filteredData = formattedData;

    if (fromDate || toDate) {
      filteredData = formattedData.filter((row) => {
        const rowDateParts = row.date.split("/");
        const rowDate = new Date(
          `${rowDateParts[2]}-${rowDateParts[1]}-${rowDateParts[0]}`
        );
        let fromDateObj = null;
        let toDateObj = null;

        if (fromDate) {
          const fromDateParts = fromDate.split("/");
          fromDateObj = new Date(
            `${fromDateParts[2]}-${fromDateParts[1]}-${fromDateParts[0]}`
          );
          fromDateObj.setHours(0, 0, 0, 0); // Reset time to midnight
        }

        if (toDate) {
          const toDateParts = toDate.split("/");
          toDateObj = new Date(
            `${toDateParts[2]}-${toDateParts[1]}-${toDateParts[0]}`
          );
          toDateObj.setHours(23, 59, 59, 999); // Set time to end of day
        }

        if (fromDateObj && rowDate < fromDateObj) {
          return false;
        }
        if (toDateObj && rowDate > toDateObj) {
          return false;
        }
        return true;
      });
    }

    if (filteredData.length === 0) {
      alert("No data found for the selected date range");
      return;
    }

    const totalAmount = filteredData.reduce(
      (total, row) => total + parseFloat(row.payments),
      0
    );

    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Index",
          "Payment ID",
          "Booking ID",
          "Payment Amount",
          "Status",
          "Date & Time",
        ],
      ],
      body: filteredData.map((row, index) => [
        index + 1,
        row.paymentId,
        row.bookingId,
        row.payments,
        row.status,
        `${row.date} ${row.time}`,
      ]),
    });

    if (fromDate || toDate) {
      doc.autoTable({
        body: [
          ["Total Amount", "", "", "", totalAmount.toFixed(2), "", "", ""],
        ],
        startY: doc.lastAutoTable.finalY + 10, // Start below the last table
      });
    }

    doc.save("payment_report.pdf");
  };

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
                      <div className=" col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            <label htmlFor="fromDate">From Date:</label>
                            <input
                              className="form-control"
                              type="date"
                              id="fromDate"
                              max={toDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="toDate">To Date:</label>
                            <input
                              className="form-control"
                              type="date"
                              id="toDate"
                              min={fromDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-primary w-25"
                          onClick={handleGenerateReport}
                        >
                          Generate Report
                        </button>
                      </div>
                      <h4 className="card-title">Payment Table</h4>
                      <div className="table-responsive">
                        {formattedData?.length === 0 ? (
                          <p>No data available</p>
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
                                { label: "Payment ID", field: "paymentId" },
                                { label: "Booking ID", field: "bookingId" },
                                { label: "Amount", field: "payments" },
                                { label: "Status", field: "status" },
                                { label: "Date", field: "date" },
                                { label: "Time", field: "time" },
                              ],
                              rows: formattedData,
                            }}
                            ref={tableRef}
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

export default Payment;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Cleint.css";

const API_URL = "http://147.93.107.44:5000";

const View_Client = () => {
  const token = JSON.parse(localStorage.getItem("authToken"));
  const [ClientData, setClientData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentClient, setCurrentClient] = useState({
    _id: "",
    WhaClientName: "",
    WhaCount: "",
    WhaBalCount: "",
    IsAdmin: false,
    IsActive: false,
    StaticIP: "",
    IsOWNWhatsapp: false,
    Database: "",
    Password: "",
    UserName: "",
    Port: "",
    AdminID: null,
    Server: "",
    FolderName: "",
  });

  const navigate = useNavigate();
  const [adminName, setAdminNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  // Fetch client and admin data
  const fetchData = () => {
    axios
      .get(`${API_URL}/client_view_All`, {
        headers: {
          Authorization: token,
          "Cache-Control": "no-store",
        },
      })
      .then((res) => {
        setClientData(res.data.data);
        console.log("Client Data:", res.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching client data");
      });

    axios
      .get(`${API_URL}/admin_view`)
      .then((response) => {
        console.log("Admin Data:", response.data);
        setAdminNames(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching admin names:", error);
        setAdminNames([]);
      });
  };

  // Delete a client
  const deleteClient = (clientId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (isConfirmed) {
      axios
        .get(`${API_URL}/client_delete/${clientId}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setClientData(ClientData.filter((client) => client._id !== clientId));
          toast.success("Client deleted successfully");
        })
        .catch((error) => {
          toast.error("Error deleting client");
        });
    }
  };

  // Update a client
  const updateClient = () => {
    const updatedClient = {
      ...currentClient,
      AdminID: currentClient.AdminID ? currentClient.AdminID._id : null,
    };

    axios
      .put(`${API_URL}/client_update/${currentClient._id}`, updatedClient, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log("Update response:", res.data);

        // Update the client list properly
        setClientData(
          ClientData.map((client) =>
            client._id === currentClient._id
              ? { ...updatedClient, AdminID: currentClient.AdminID }
              : client
          )
        );

        setShowModal(false);
        toast.success("Client updated successfully");
      })
      .catch((error) => {
        console.error("Error updating client:", error);
        toast.error("Error updating client");
      });
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "Adminname") {
      const selectedAdmin = adminName.find((admin) => admin._id === value);
      setCurrentClient((prevState) => ({
        ...prevState,
        AdminID: selectedAdmin
          ? { _id: selectedAdmin._id, AdminName: selectedAdmin.AdminName }
          : null,
        [name]: value,
      }));
    } else {
      setCurrentClient((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Open the update modal and set the current client data
  const openUpdateModal = (client) => {
    setCurrentClient({
      ...client,
      Adminname: client?.AdminID?._id || "",
    });
    setShowModal(true);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [token]);

  // Filter client data based on search term
  const filteredClientData = ClientData.filter((client) =>
    client.WhaClientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClientData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Header Section */}
      <div
        className="addadmin_header"
        style={{
          height: "80px",
          backgroundColor: "#D6DCEC",
          marginTop: "60px",
        }}
      >
        <div style={{ backgroundColor: "rgba(97, 158, 208, 1)" }}>
          <div className="d-flex justify-content-center py-4">
            <h3
              className="rounded-2 m-0 px-5 text-white uppercase"
              style={{ backgroundColor: "black" }}
            >
              View Client Detail
            </h3>
          </div>
        </div>
      </div>

      {/* Buttons for toggling active clients and navigating */}
      <div className="d-flex justify-content-center mt-5 responsive-buttons">
        <button
          className="btn btn-primary responsive-btn"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          style={{ marginRight: "10px" }}
        >
          {showActiveOnly ? "Client Data" : "Client Data"}
        </button>
        <button
          className="btn btn-secondary responsive-btn"
          onClick={() => navigate("/View_CleintDT")}
        >
          Client Details
        </button>
      </div>

      {/* Search Bar */}
      <div className="container-fluid my-4 responsive-search">
        <div className="d-flex align-items-center mb-3">
          <label
            htmlFor="searchClient"
            className="form-label me-2 mb-0 fw-bold"
          >
            Search Client:
          </label>
          <div className="input-group responsive-input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control responsive-input"
              id="searchClient"
              placeholder="Search by client name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Client Data Table */}
        <div className="table-responsive responsive-table">
          <table className="table table-bordered table-hover text-left">
            <thead className="table-primary text-center">
              <tr>
                <th>NO</th>
                <th>Client Name</th>
                <th>Admin Name</th>
                <th>Total Balance</th>
                <th>Balance</th>
                <th>Admin</th>
                <th>Active</th>
                <th>Static IP</th>
                <th>Own Whatsapp</th>
                <th>Database</th>
                <th>UserName</th>
                <th>Port</th>
                <th>Server</th>
                <th>Folder Name</th>

                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td data-label="NO" style={{ textAlign: "center" }}>
                      {index + 1}
                    </td>
                    <td data-label="CLIENT NAME">
                      {item?.WhaClientName?.toUpperCase() || "N/A"}
                    </td>
                    <td data-label="ADMIN NAME">
                      {item?.AdminID?.AdminName?.toUpperCase() || "N/A"}
                    </td>
                    <td data-label="COUNT">
                      {item?.WhaCount
                        ? parseFloat(item?.WhaCount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td data-label="BALANCE COUNT">
                      {item?.WhaBalCount
                        ? parseFloat(item?.WhaBalCount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td data-label="IS ADMIN">
                      {item?.IsAdmin !== undefined
                        ? item.IsAdmin.toString().toUpperCase()
                        : "N/A"}
                    </td>
                    <td data-label="IS ACTIVE">
                      {item?.IsActive !== undefined
                        ? item.IsActive.toString().toUpperCase()
                        : "N/A"}
                    </td>
                    <td data-label="STATIC IP">{item?.StaticIP || "N/A"}</td>
                    <td data-label="IS OWN WHATSAPP">
                      {item?.IsOWNWhatsapp !== undefined
                        ? item.IsOWNWhatsapp.toString().toUpperCase()
                        : "N/A"}
                    </td>
                    <td data-label="DATABASE">
                      {item?.Database?.toUpperCase() || "N/A"}
                    </td>
                    <td data-label="USERNAME">
                      {item?.UserName?.toUpperCase() || "N/A"}
                    </td>
                    <td data-label="PORT">{item?.Port || "N/A"}</td>
                    <td data-label="SERVER">
                      {item?.Server?.toUpperCase() || "N/A"}
                    </td>

                    <td data-label="FolderName">
                      {item?.FolderName?.toUpperCase() || "N/A"}
                    </td>
                    <td data-label="ACTION">
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => openUpdateModal(item)}
                        >
                          UPDATE
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteClient(item._id)}
                        >
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center text-danger fw-bold">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-end mt-4 responsive-pagination">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              >
                <a className="page-link" href="#">
                  Previous
                </a>
              </li>

              {/* Show first page */}
              {currentPage > 2 && (
                <li className="page-item" onClick={() => paginate(1)}>
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
              )}

              {/* Show second page */}
              {currentPage > 3 && (
                <li className="page-item" onClick={() => paginate(2)}>
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
              )}

              {/* Ellipses between pages */}
              {currentPage > 3 && (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
              )}

              {/* Show current page */}
              <li className={`page-item active`}>
                <a className="page-link" href="#">
                  {currentPage}
                </a>
              </li>

              {/* Ellipses before last page */}
              {currentPage <
                Math.ceil(filteredClientData.length / itemsPerPage) - 2 && (
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    ...
                  </a>
                </li>
              )}

              {/* Show last page */}
              {currentPage <
                Math.ceil(filteredClientData.length / itemsPerPage) - 1 && (
                <li
                  className="page-item"
                  onClick={() =>
                    paginate(
                      Math.ceil(filteredClientData.length / itemsPerPage)
                    )
                  }
                >
                  <a className="page-link" href="#">
                    {Math.ceil(filteredClientData.length / itemsPerPage)}
                  </a>
                </li>
              )}

              <li
                className={`page-item ${
                  currentPage ===
                  Math.ceil(filteredClientData.length / itemsPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage <
                    Math.ceil(filteredClientData.length / itemsPerPage) &&
                  paginate(currentPage + 1)
                }
              >
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Update Client Modal */}
      {showModal && (
        <div
          className="modal fade show responsive-modal"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="modalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalLabel">
                  UPDATE CLIENT
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="clientName" className="form-label">
                      {" "}
                      CLIENT NAME
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="clientName"
                      name="WhaClientName"
                      value={currentClient.WhaClientName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-6 mb-3">
                    <label htmlFor="adminName" className="form-label">
                      ADMIN NAME
                    </label>
                    <select
                      className="form-select"
                      id="Adminname"
                      name="Adminname"
                      value={currentClient.Adminname}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Admin</option>
                      {adminName.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.AdminName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="whatsappCount" className="form-label">
                      {" "}
                      TOTAL BALANCE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="whatsappCount"
                      name="WhaCount"
                      value={parseFloat(currentClient.WhaCount)}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label
                      htmlFor="whatsappBalanceCount"
                      className="form-label"
                    >
                      {" "}
                      BALANCE
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="whatsappBalanceCount"
                      name="WhaBalCount"
                      value={parseFloat(currentClient.WhaBalCount)}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isAdmin"
                      name="IsAdmin"
                      checked={currentClient.IsAdmin}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isAdmin">
                      {" "}
                      ADMIN
                    </label>
                  </div>
                  <div className="col-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      name="IsActive"
                      checked={currentClient.IsActive}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      {" "}
                      ACTIVE{" "}
                    </label>
                  </div>
                  <div className="col-4 mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isOwnWhatsapp"
                      name="IsOWNWhatsapp"
                      checked={currentClient.IsOWNWhatsapp}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isOwnWhatsapp">
                      {" "}
                      OWN WHATSAPP{" "}
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="userName" className="form-label">
                      {" "}
                      USERNAME{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      name="UserName"
                      value={currentClient.UserName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      {" "}
                      PASSWORD
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="password"
                      name="Password"
                      value={currentClient.Password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="database" className="form-label">
                      {" "}
                      DATABASE{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="database"
                      name="Database"
                      value={currentClient.Database}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="port" className="form-label">
                      {" "}
                      PORT{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="port"
                      name="Port"
                      value={currentClient.Port}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label htmlFor="staticIP" className="form-label">
                      {" "}
                      STATIC IP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="staticIP"
                      name="StaticIP"
                      value={currentClient.StaticIP}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label htmlFor="Server" className="form-label">
                      {" "}
                      SERVER{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Server"
                      name="Server"
                      value={currentClient.Server}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <label htmlFor="FolderName" className="form-label">
                    {" "}
                    FolderName{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="FolderName"
                    name="FolderName"
                    value={currentClient.FolderName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  {" "}
                  CLOSE
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={updateClient}
                >
                  UPDATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default View_Client;

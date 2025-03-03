import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cleint.css";

const API_URL = "http://147.93.107.44:5000";

const Add_Client = () => {
  const [adminName, setAdminNames] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/admin_view`)
      .then((response) => {
        console.log("API Response:", response.data);
        setAdminNames(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching admin names:", error);
        setAdminNames([]);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      WhaClientName: "",
      WhaCount: 0,
      WhaBalCount: 0,
      Adminname: "",
      IsAdmin: false,
      IsActive: false,
      StaticIP: "",
      IsOWNWhatsapp: false,
      Database: "",
      Password: "",
      UserName: "",
      Port: "",

      FolderName: "",
    },
    validationSchema: Yup.object({
      WhaClientName: Yup.string().required("Client Name is required"),
      WhaCount: Yup.string().required("Whatsapp Count is required"),
      WhaBalCount: Yup.string().required("Whatsapp Balance Count is required"),
      Adminname: Yup.string().required("Admin Name is required"),
      UserName: Yup.string().required("Username is required"),
      Password: Yup.string().required("Password is required"),
      Database: Yup.string().required("Database is required"),
      Port: Yup.string().required("Port is required"),
      StaticIP: Yup.string().required("Static IP is required"),

      FolderName: Yup.string().required("FolderName is required"),
    }),
    onSubmit: (values) => {
      if (!values.Adminname) {
        toast.error("Please select an admin");
        return;
      }

      axios
        .post(`${API_URL}/client_add/${values.Adminname}`, values)
        .then((response) => {
          console.log("Client added successfully:", response);
          toast.success("Client added successfully");

          formik.resetForm();
        })
        .catch((error) => {
          console.error("Error adding client:", error);
          toast.error("Error adding client");
        });
    },
  });

  return (
    <div>
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
              className="rounded-2 m-0 px-5 text-white"
              style={{ backgroundColor: "black" }}
            >
              Add Client
            </h3>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-5">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-light p-4 rounded shadow-sm"
          style={{ width: "100%", maxWidth: "600px" }}
        >
          {/* Client Name, Admin Name */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="WhaClientName" className="custom-label fw-bold">
                Client Name
              </label>
              <input
                type="text"
                className="form-control"
                id="WhaClientName"
                name="WhaClientName"
                value={formik.values.WhaClientName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.WhaClientName && formik.errors.WhaClientName ? (
                <div className="text-danger">{formik.errors.WhaClientName}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="Adminname" className="custom-label fw-bold">
                Admin Name
              </label>
              <select
                className="form-select"
                id="Adminname"
                name="Adminname"
                value={formik.values.Adminname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select Admin</option>
                {adminName.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.AdminName}
                  </option>
                ))}
              </select>
              {formik.touched.Adminname && formik.errors.Adminname ? (
                <div className="text-danger">{formik.errors.Adminname}</div>
              ) : null}
            </div>
          </div>

          {/* Whatsapp Count, Whatsapp Balance Count */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="WhaCount" className="custom-label fw-bold">
                Total Count
              </label>
              <input
                type="text"
                className="form-control"
                id="WhaCount"
                name="WhaCount"
                value={formik.values.WhaCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
              />
              {formik.touched.WhaCount && formik.errors.WhaCount ? (
                <div className="text-danger">{formik.errors.WhaCount}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="WhaBalCount" className="custom-label fw-bold">
                Balance
              </label>
              <input
                type="text"
                className="form-control"
                id="WhaBalCount"
                name="WhaBalCount"
                value={formik.values.WhaBalCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly
              />
              {formik.touched.WhaBalCount && formik.errors.WhaBalCount ? (
                <div className="text-danger">{formik.errors.WhaBalCount}</div>
              ) : null}
            </div>
          </div>

          {/* Is Admin, Is Active, Own WhatsApp */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="IsAdmin"
                  name="IsAdmin"
                  checked={formik.values.IsAdmin}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label fw-bold" htmlFor="IsAdmin">
                  Is Admin
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="IsActive"
                  name="IsActive"
                  checked={formik.values.IsActive}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label fw-bold" htmlFor="IsActive">
                  Is Active
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="IsOWNWhatsapp"
                  name="IsOWNWhatsapp"
                  checked={formik.values.IsOWNWhatsapp}
                  onChange={formik.handleChange}
                />
                <label
                  className="form-check-label fw-bold"
                  htmlFor="IsOWNWhatsapp"
                >
                  Own WhatsApp
                </label>
              </div>
            </div>
          </div>

          {/* Username, Password */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="UserName" className="custom-label fw-bold">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="UserName"
                name="UserName"
                value={formik.values.UserName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.UserName && formik.errors.UserName ? (
                <div className="text-danger">{formik.errors.UserName}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="Password" className="custom-label fw-bold">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="Password"
                name="Password"
                value={formik.values.Password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Password && formik.errors.Password ? (
                <div className="text-danger">{formik.errors.Password}</div>
              ) : null}
            </div>
          </div>

          <div className="row mb-3">
            {/* Database */}
            <div className="col-md-6">
              <label htmlFor="Database" className="custom-label fw-bold">
                Database
              </label>
              <input
                type="text"
                className="form-control"
                id="Database"
                name="Database"
                value={formik.values.Database}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Database && formik.errors.Database ? (
                <div className="text-danger">{formik.errors.Database}</div>
              ) : null}
            </div>

            {/* Port */}
            <div className="col-md-6">
              <label htmlFor="Port" className="custom-label fw-bold">
                Port
              </label>
              <input
                type="text"
                className="form-control"
                id="Port"
                name="Port"
                value={formik.values.Port}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.Port && formik.errors.Port ? (
                <div className="text-danger">{formik.errors.Port}</div>
              ) : null}
            </div>
          </div>
          <div className="row mb-3">
            {/* Static IP */}
            <div className="col-md-6">
              <label htmlFor="StaticIP" className="custom-label fw-bold">
                Static IP
              </label>
              <input
                type="text"
                className="form-control"
                id="StaticIP"
                name="StaticIP"
                value={formik.values.StaticIP}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.StaticIP && formik.errors.StaticIP ? (
                <div className="text-danger">{formik.errors.StaticIP}</div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label htmlFor="FolderName" className="custom-label fw-bold">
                FolderName
              </label>
              <input
                type="text"
                className="form-control"
                id="FolderName"
                name="FolderName"
                value={formik.values.FolderName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.FolderName && formik.errors.FolderName ? (
                <div className="text-danger">{formik.errors.FolderName}</div>
              ) : null}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Submit
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Add_Client;

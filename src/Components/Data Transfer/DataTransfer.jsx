import axios from "axios";
import { Field, Formik, Form } from "formik"; // Import Formik and Form
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = "http://147.93.107.44:5000";

const DataTransfer = () => {
  const [clientNames, setClientNames] = useState([]);

  useEffect(() => {
    // Fetch clients on component mount
    axios
      .get(`${API_URL}/client_view_All`)
      .then((response) => {
        setClientNames(response.data.data);
        console.log("Fetched client names:", response.data.data); // Log fetched client names
      })
      .catch((error) => {
        toast.error("Error fetching client names!");
        console.error("Error fetching client names:", error);
      });
  }, []);

  return (
    <div>
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

      <Formik
        initialValues={{ ClientID: "" }} // Provide initial values
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // Find the selected client's StaticIP
          const selectedClient = clientNames.find(
            (client) => client._id === values.ClientID
          );

          if (selectedClient) {
            const staticIP = selectedClient.StaticIP;

            // Make the POST request to the API
            axios
              .post(`${API_URL}/mongotosql/${staticIP}`)
              .then((response) => {
                toast.success("Data Submitted  successfully!");
                console.log("Data transfer response:", response.data);
                resetForm(); // Reset the form after successful submission
              })
              .catch((error) => {
                toast.error("Error Submitted data transfer!");
                console.error("Error Submitted data transfer:", error);
              })
              .finally(() => {
                setSubmitting(false); // Reset submitting state
              });
          } else {
            toast.error("Selected client not found!");
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <div className="d-flex justify-content-center align-items-center mt-4">
            <Form
              className="bg-light p-4 rounded shadow-sm"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <div className="mb-3">
                <label htmlFor="ClientID" className="form-label fw-bold">
                  Client Name
                </label>
                <Field as="select" name="ClientID" className="form-select">
                  <option value="">Select Client Name</option>
                  {clientNames.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.WhaClientName}
                    </option>
                  ))}
                </Field>
              </div>

              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100" // Make the button full width
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default DataTransfer;

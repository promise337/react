import React, { useState } from "react";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";


const BASE_URL = "http://localhost:5000/api/v1";

const Subscription = () => {
  const [acctNo, setAcctNo] = useState("");
  const [acctName, setAcctName] = useState("");
  const [branch, setBranch] = useState("");
  const [threshold, setThreshold] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(false);

  /* ----------------------------------
     VERIFY ACCOUNT
  ---------------------------------- */
  const verifyAccount = async () => {
    if (!acctNo) {
      setStatusMessage("Please enter an account number.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Verifying account...");
      setVerified(false);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/customers/${acctNo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Account not found");
      }

      setAcctName(result.data.AC_DESC);
      setBranch(result.data.BRANCH_CODE);
      setStatusMessage("Account verified successfully.");
      setVerified(true);

    } catch (error) {
      setAcctName("");
      setBranch("");
      setStatusMessage(error.message);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     SUBSCRIBE
  ---------------------------------- */
  const handleSubscribe = async () => {
    if (!verified) {
      setStatusMessage("Please verify account first.");
      return;
    }

    if (!threshold) {
      setStatusMessage("Please enter reorder threshold.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Submitting subscription...");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/subscriptions/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            cust_ac_no: acctNo,
            branch_code: branch,
            reorder_threshold_number: Number(threshold),
            subscribed: "Y",
            notify_sms: notifySMS ? "Y" : "N",
            notify_email: notifyEmail ? "Y" : "N",
            notify_rm: "Y"
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Subscription failed");
      }

      setSubscribed(true);
      setStatusMessage("Subscription successful ✅");

    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
   UPDATE SUBSCRIPTION
---------------------------------- */
const handleUpdate = async () => {
  if (!subscribed) {
    setStatusMessage("You must subscribe before updating.");
    return;
  }

  if (!acctNo || !threshold) {
    setStatusMessage("Account number and threshold are required.");
    return;
  }

  try {
    setLoading(true);
    setStatusMessage("Updating subscription...");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${BASE_URL}/subscriptions/${acctNo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          branch_code: branch,
          reorder_threshold_number: Number(threshold),
          subscribed: "Y",
          notify_sms: notifySMS ? "Y" : "N",
          notify_email: notifyEmail ? "Y" : "N"
        }),
      }
    );

    const result = await response.json();

    if (result.message === "Token has expired") {
      alert("Session expired. Please login again.");
      localStorage.clear();
      navigate("/");
      return;
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Update failed");
    }

    setStatusMessage("Subscription updated successfully ✅");

  } catch (error) {
    setStatusMessage(error.message);
  } finally {
    setLoading(false);
  }
};



  /* ----------------------------------
     UNSUBSCRIBE
  ---------------------------------- */
  const handleUnsubscribe = async () => {
    if (!verified) {
      setStatusMessage("Please verify account first.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Processing unsubscribe...");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/subscriptions/unsubscribe/${acctNo}`,
        {
          method: "PUT", // change to DELETE if your backend expects DELETE
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unsubscribe failed");
      }

      setSubscribed(false);
      setStatusMessage("Customer unsubscribed successfully ✅");

    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <header>
          <div className="logo">
            <img src="/omni_logo.png" alt="OmniBSIC Logo" />
          </div>
          <div>
            <h1>Chequebook Reorder Alert Service</h1>
            <div className="note">
              Never run out of cheques, get notified and reorder on time.
            </div>
          </div>
        </header>

        {/* Account Number */}
        <div>
          <label>Account Number</label>
          <div className="accountverify">
            <input
              type="text"
              value={acctNo}
              onChange={(e) => setAcctNo(e.target.value)}
              placeholder="Enter account number"
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={verifyAccount}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
          <div className="note">{statusMessage}</div>
        </div>

        {/* Account Details */}
        <div style={{ marginTop: "14px" }}>
          <label>Account Name</label>
          <input type="text" value={acctName} readOnly className="readonly" />

          <label style={{ marginTop: "10px" }}>Branch</label>
          <input type="text" value={branch} readOnly className="readonly" />
        </div>

        {/* Threshold */}
        <div style={{ marginTop: "16px" }}>
          <label>Reorder Threshold</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            disabled={!verified || subscribed}
          />
        </div>

        {/* Notification Channels */}
        <div style={{ marginTop: "14px" }}>
          <label>Notification Channels</label>
          <div className="checkboxes">
            <label>
              <input type="checkbox" checked disabled />
              Relationship Manager (Mandatory)
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifySMS}
                disabled={!verified || subscribed}
                onChange={() => setNotifySMS(!notifySMS)}
              />
              SMS
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifyEmail}
                disabled={!verified || subscribed}
                onChange={() => setNotifyEmail(!notifyEmail)}
              />
              Email
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          {!subscribed ? (
            <button
              className="btn-primry"
              onClick={handleSubscribe}
              disabled={!verified || loading}
            >
              {loading ? "Processing..." : "Subscribe"}
            </button>
          ) : (
            <button
              className="btn-danger"
              onClick={handleUnsubscribe}
              disabled={loading}
            >
              {loading ? "Processing..." : "Unsubscribe"}
            </button>
          )}
        </div>

        <div className="footer">
          ©2025 OmniBSIC Bank. Powered by Xnett. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Subscription;

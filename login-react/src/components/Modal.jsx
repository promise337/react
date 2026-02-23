import React from "react";
import "./Modal.css";

export default function Modal({ title, message, onClose }) {
  if (!title && !message) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="ok">
          <button className="btn-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

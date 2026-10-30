import React, { useState } from "react";
import axios from "axios";
import barcodeImg from "../assets/barcode.jfif";
import "./ConsultationBooking.css";

function ConsultationBooking() {
  // Current date formatted for min attribute in date picker
  const todayStr = new Date().toISOString().split("T")[0];

  // Morning slots requested by user
  const morningSlots = [
    { start: "10:00 AM", end: "12:00 PM" },
    { start: "10:30 AM", end: "12:30 PM" },
    { start: "11:00 AM", end: "1:00 PM" },
    { start: "11:30 AM", end: "1:30 PM" },
  ];

  // Evening slots requested by user
  const eveningSlots = [
    { start: "4:00 PM", end: "6:00 PM" },
    { start: "4:30 PM", end: "6:30 PM" },
    { start: "7:00 PM", end: "9:00 PM" },
    { start: "9:30 PM", end: "11:30 PM" },
    
  ];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [slotPeriod, setSlotPeriod] = useState("morning"); // "morning" | "evening"
  const [selectedSlot, setSelectedSlot] = useState(morningSlots[0]);
  const [upiTransactionId, setUpiTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [clientInfo, setClientInfo] = useState({
    name: "",
    mobile: "",
    email: "",
    case_type: "",
    message: "",
  });

  const [confirmedPass, setConfirmedPass] = useState(null);

  const parseTimeTo24h = (timeStr) => {
    if (!timeStr) return "090000";
    const trimmed = timeStr.trim();
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return "090000";
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const modifier = match[3].toUpperCase();

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const hh = String(hours).padStart(2, "0");
    return `${hh}${minutes}00`;
  };

  const getGoogleCalendarUrl = (booking) => {
    if (!booking || !booking.date || !booking.time_slot) return "#";
    try {
      const parts = booking.time_slot.split("-").map((s) => s.trim());
      const startTimeStr = parts[0] || "9:00 AM";
      const endTimeStr = parts[1] || "11:00 AM";

      const cleanDate = (booking.date || "").replace(/-/g, "");
      const startIso = `${cleanDate}T${parseTimeTo24h(startTimeStr)}`;
      const endIso = `${cleanDate}T${parseTimeTo24h(endTimeStr)}`;

      const title = `Legal Consultation - Advocate Bittoo Sharma (${booking.token})`;
      const details = `Advocate: Advocate Bittoo Sharma\nBooking Token: ${booking.token}\nClient Name: ${booking.name}\nCase Category: ${booking.case_type}\nDuration: 2 Hours\nPayment: ₹5,000 (UPI Ref: ${booking.upi_ref})\nHelpline: +91 8077767256`;
      const location = `Sarbit Legal Law Firm, Chamber No. 319 & 1052, Civil Court Ghaziabad`;

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&ctz=Asia/Kolkata&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    } catch {
      return "https://calendar.google.com";
    }
  };

  const clientSlipWhatsAppMsg = confirmedPass
    ? `🏛️ *SARBIT LEGAL LAW FIRM*
*Advocate Consultation Confirmed ✅*
━━━━━━━━━━━━━━━━━━━━
🎫 *Booking ID:* ${confirmedPass.token}
👤 *Client Name:* ${confirmedPass.name}
📱 *Mobile:* ${confirmedPass.mobile}
⚖️ *Advocate:* Advocate Bittoo Sharma
📅 *Consultation Date:* ${confirmedPass.date}
⏰ *Time Slot:* ${confirmedPass.time_slot} (2 Hours Dedicated)
📁 *Case Category:* ${confirmedPass.case_type}
💰 *Consultation Fee:* ₹5,000 (Paid via UPI)
🔢 *UPI Ref / UTR:* ${confirmedPass.upi_ref}
${confirmedPass.message ? `📝 *Client Note:* ${confirmedPass.message}\n` : ""}
📍 *Chamber / Office:* Chamber No. 319 & 1052, Civil Court Ghaziabad
📞 *Helpline / Inquiry:* +91 8077767256
━━━━━━━━━━━━━━━━━━━━
_Please keep this slip saved for your scheduled consultation session._`
    : "";

  const adminAlertWhatsAppMsg = confirmedPass
    ? `🔔 *NEW CONSULTATION BOOKING ALERT*
*Sarbit Legal Law Firm Consultation Portal*
━━━━━━━━━━━━━━━━━━━━
🎫 *Token ID:* ${confirmedPass.token}
👤 *Client Name:* ${confirmedPass.name}
📱 *Mobile Number:* ${confirmedPass.mobile}
📧 *Email:* ${confirmedPass.email || "Not Provided"}
📁 *Case Category:* ${confirmedPass.case_type}
📅 *Consultation Date:* ${confirmedPass.date}
⏰ *Time Slot:* ${confirmedPass.time_slot} (2 Hours)
💵 *Consultation Fee:* ₹5,000 (Paid via UPI)
🔢 *UPI Ref / UTR:* ${confirmedPass.upi_ref}
${confirmedPass.message ? `📝 *Client Note:* ${confirmedPass.message}\n` : ""}
━━━━━━━━━━━━━━━━━━━━
_Please verify this UTR in your bank / UPI statement._`
    : "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyUpi = () => {
    const upiId = "8077767256@upi";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(upiId)
        .then(() => {
          setCopiedUpi(true);
          setTimeout(() => setCopiedUpi(false), 2500);
        })
        .catch(() => fallbackCopy(upiId));
    } else {
      fallbackCopy(upiId);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePeriodChange = (period) => {
    setSlotPeriod(period);
    if (period === "morning") {
      setSelectedSlot(morningSlots[0]);
    } else {
      setSelectedSlot(eveningSlots[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!clientInfo.name.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!clientInfo.mobile.trim() || clientInfo.mobile.trim().length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!clientInfo.case_type) {
      alert("Please select a case category.");
      return;
    }
    if (!upiTransactionId.trim()) {
      alert("Please enter the 12-digit UPI Transaction / UTR ID after payment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tokenCode = "ADV-" + Math.floor(100000 + Math.random() * 900000);
      const bookingPayload = {
        booking_token: tokenCode,
        name: clientInfo.name.trim(),
        mobile: clientInfo.mobile.trim(),
        email: clientInfo.email.trim() || null,
        case_type: clientInfo.case_type,
        consultation_date: selectedDate,
        time_slot: `${selectedSlot.start} - ${selectedSlot.end}`,
        slot_period: slotPeriod,
        duration: "2 Hours",
        fee: 5000,
        payment_mode: "UPI",
        upi_ref: upiTransactionId.trim(),
        payment_status: "verified",
        message: clientInfo.message.trim(),
        booking_status: "confirmed",
      };

      await axios.post("http://localhost:5000/sarbit/consultation_bookings", bookingPayload);

      setConfirmedPass({
        token: tokenCode,
        name: bookingPayload.name,
        mobile: bookingPayload.mobile,
        email: bookingPayload.email,
        case_type: bookingPayload.case_type,
        date: bookingPayload.consultation_date,
        time_slot: bookingPayload.time_slot,
        payment_mode: "UPI",
        upi_ref: upiTransactionId.trim(),
        fee: 5000,
        bookedAt: new Date().toLocaleString(),
      });
      setIsSubmitting(false);
      alert("Consultation Booking Confirmed! UPI details received successfully ✅");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Error processing consultation booking: " + (err.response?.data?.message || err.message));
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedPass(null);
    setClientInfo({
      name: "",
      mobile: "",
      email: "",
      case_type: "",
      message: "",
    });
    setUpiTransactionId("");
    setSelectedDate(todayStr);
    setSlotPeriod("morning");
    setSelectedSlot(morningSlots[0]);
  };

  return (
    <section id="book-consultation" className="consult-booking-section">
      <div className="container">
        {/* Header */}
        <div className="row justify-content-center text-center mb-4">
          <div className="col-lg-8 col-md-10">
            <span className="consult-badge">Book Online Consultation</span>
            <h2 className="consult-title">Advocate Consultation Form</h2>
            <p className="consult-desc">
              Book your direct <strong>2-Hour personalized legal consultation</strong> with Advocate Bittoo Sharma.
              Select your date, morning or evening timing, and confirm with ease.
            </p>
            <div className="consult-price-pill">
              Consultation Fee: <span>₹5,000 / 2 Hours</span>
            </div>
          </div>
        </div>

        {/* Confirmed Slip or Booking Form */}
        {confirmedPass ? (
          <div className="consult-receipt-card">
            <div className="receipt-header">
              <div className="check-icon">✓</div>
              <h3>Consultation Confirmed</h3>
              <p className="receipt-id">
                Token / Booking ID: <span>{confirmedPass.token}</span>
              </p>
            </div>

            <div className="receipt-grid">
              <div className="receipt-item">
                <span className="r-label">Advocate:</span>
                <span className="r-val">Advocate Bittoo Sharma</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Session Duration:</span>
                <span className="r-val text-gold">2 Hours Session</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Consultation Date:</span>
                <span className="r-val">{confirmedPass.date}</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Time Slot:</span>
                <span className="r-val">{confirmedPass.time_slot}</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Client Name:</span>
                <span className="r-val">{confirmedPass.name}</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Mobile Number:</span>
                <span className="r-val">{confirmedPass.mobile}</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Case Category:</span>
                <span className="r-val">{confirmedPass.case_type}</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Payment Mode:</span>
                <span className="r-val">UPI (Scan & Pay)</span>
              </div>
              <div className="receipt-item">
                <span className="r-label">Payment Status:</span>
                <span className="r-val r-paid">₹5,000 (Paid / Confirmed)</span>
              </div>
              <div className="receipt-item full-row">
                <span className="r-label">UPI Reference / UTR Number:</span>
                <span className="r-val code-val">{confirmedPass.upi_ref}</span>
              </div>
            </div>

            {/* Automated WhatsApp Alerts & Google Calendar Section */}
            <div className="receipt-sync-card">
              <div className="sync-card-header">
                <span className="sync-badge">
                  <i className="fa fa-bolt mr-1"></i> Instant Sync & Automated Alerts
                </span>
                <h5 className="sync-title">WhatsApp Confirmation & Calendar Reminder</h5>
                <p className="sync-subtitle">
                  Save your consultation details to WhatsApp or sync directly with Google Calendar.
                </p>
              </div>

              <div className="sync-actions-grid">
                {/* 1. Client WhatsApp Booking Slip */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(clientSlipWhatsAppMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-sync-action btn-sync-wa"
                  title="Receive or share your booking confirmation on WhatsApp"
                >
                  <div className="sync-icon">
                    <i className="fa fa-whatsapp"></i>
                  </div>
                  <div className="sync-text">
                    <strong>Get Slip on WhatsApp</strong>
                    <span>Share or save slip directly to your WhatsApp</span>
                  </div>
                </a>

                {/* 2. Instant Admin Alert */}
                <a
                  href={`https://wa.me/918077767256?text=${encodeURIComponent(adminAlertWhatsAppMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-sync-action btn-sync-admin"
                  title="Notify Advocate Bittoo Sharma directly on WhatsApp"
                >
                  <div className="sync-icon">
                    <i className="fa fa-bell"></i>
                  </div>
                  <div className="sync-text">
                    <strong>Notify Advocate Office</strong>
                    <span>Send booking & UTR alert to +91 8077767256</span>
                  </div>
                </a>

                {/* 3. Add to Google Calendar */}
                <a
                  href={getGoogleCalendarUrl(confirmedPass)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-sync-action btn-sync-cal"
                  title="Add 2-hour legal consultation session to your Google Calendar"
                >
                  <div className="sync-icon">
                    <i className="fa fa-calendar-check-o"></i>
                  </div>
                  <div className="sync-text">
                    <strong>Add to Google Calendar</strong>
                    <span>Auto-sync 2-Hour dedicated slot & set reminder</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="receipt-actions">
              <button
                type="button"
                className="btn-print-slip"
                onClick={() => window.print()}
              >
                🖨️ Print / Download Slip
              </button>
              <button
                type="button"
                className="btn-new-booking"
                onClick={handleReset}
              >
                + Book Another Consultation
              </button>
            </div>
          </div>
        ) : (
          <div className="consult-form-wrapper">
            <form onSubmit={handleFormSubmit}>
              <div className="row">
                {/* Column 1: Date & Time Slot (2 Hours) */}
                <div className="col-lg-6 col-md-12 consult-left-pane">
                  <h4 className="pane-title">1. Calendar Date & 2-Hour Time Slot</h4>

                  {/* Date Input */}
                  <div className="form-group mb-4">
                    <label className="input-title">📅 Choose Date:</label>
                    <input
                      type="date"
                      className="form-control date-control"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                    <small className="hint-text">* Past dates are disabled.</small>
                  </div>

                  {/* Morning vs Evening Switch */}
                  <div className="slot-switch-tabs mb-3">
                    <button
                      type="button"
                      className={`tab-btn ${slotPeriod === "morning" ? "active" : ""}`}
                      onClick={() => handlePeriodChange("morning")}
                    >
                      ☀️ Morning (10:00 AM - 1:30 PM)
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${slotPeriod === "evening" ? "active" : ""}`}
                      onClick={() => handlePeriodChange("evening")}
                    >
                      🌙 Evening (4:00 PM - 9:30 PM)
                    </button>
                  </div>

                  {/* Slot Pills */}
                  <div className="slots-area mb-4">
                    <label className="input-title">
                      Select {slotPeriod === "morning" ? "Morning" : "Evening"} Timing (2 Hours):
                    </label>
                    <div className="slot-pills-list">
                      {(slotPeriod === "morning" ? morningSlots : eveningSlots).map((slot, idx) => {
                        const isChosen = selectedSlot.start === slot.start;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`slot-chip ${isChosen ? "chosen" : ""}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            <span className="slot-time">{slot.start}</span>
                            <span className="slot-arrow">➔ {slot.end}</span>
                            <span className="slot-tag">2 hrs</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selection Summary Box */}
                  <div className="slot-summary-box">
                    <div className="sum-heading">Selected Consultation Window:</div>
                    <div className="sum-detail">
                      <strong>📅 Date:</strong> {selectedDate} &nbsp;|&nbsp;{" "}
                      <strong>⏰ Time:</strong> {selectedSlot.start} to {selectedSlot.end}
                      <span className="duration-tag">2 Hours Dedicated</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Client Info & Payment */}
                <div className="col-lg-6 col-md-12 consult-right-pane">
                  <h4 className="pane-title">2. Client Details & ₹5,000 Payment</h4>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="input-title">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. Rahul Sharma"
                        value={clientInfo.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="input-title">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        className="form-control"
                        placeholder="10-digit mobile"
                        maxLength="10"
                        value={clientInfo.mobile}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="input-title">Email (Optional)</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="name@email.com"
                        value={clientInfo.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="input-title">Case Category *</label>
                      <select
                        name="case_type"
                        className="form-control"
                        value={clientInfo.case_type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Criminal Law (Trial & Bail)">Criminal Law (Trial & Bail)</option>
                        <option value="Civil Law & Property Dispute">Civil Law & Property Dispute</option>
                        <option value="Matrimonial & Family Law">Matrimonial & Family Law</option>
                        <option value="Corporate & Commercial Law">Corporate & Commercial Law</option>
                        <option value="Real Estate & Registry Law">Real Estate & Registry Law</option>
                        <option value="Legal Notice / Documentation">Legal Notice / Documentation</option>
                        <option value="Other Legal Matters">Other Legal Matters</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="input-title">Brief Case Description</label>
                    <textarea
                      name="message"
                      rows="3"
                      className="form-control"
                      placeholder="Briefly state your legal issue or matter..."
                      value={clientInfo.message}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  {/* Payment Box: Only Scan & Pay via UPI QR Code */}
                  <div className="consult-payment-card mt-3">
                    <div className="pay-card-head">
                      <span>Total Consultation Fee (2 Hours)</span>
                      <strong className="price-tag">₹5,000</strong>
                    </div>

                    <div className="upi-box-wrapper">
                      <div className="upi-header-banner">
                        <span className="upi-title">
                          <i className="fa fa-qrcode mr-1 text-primary"></i> Scan & Pay via UPI QR Code
                        </span>
                        <span className="upi-badge-apps">
                          GPay • PhonePe • Paytm • BHIM
                        </span>
                      </div>

                      <div className="qr-wrapper">
                        <img
                          src={barcodeImg}
                          alt="UPI QR Code"
                          className="qr-img"
                        />
                        <div className="qr-info pt-2">
                          <p className="d-flex align-items-start flex-wrap" style={{ gap: "8px", marginBottom: "6px" }}>
                            <strong>UPI ID:</strong>
                            <code className="upi-code-badge">8077767256@upi</code>
                            <button
                              type="button"
                              className={`btn-copy-upi ${copiedUpi ? "copied" : ""}`}
                              onClick={handleCopyUpi}
                              title="Click to copy UPI ID"
                            >
                              {copiedUpi ? (
                                <>
                                  <i className="fa fa-check mr-1 text-white"></i> Copied!
                                </>
                              ) : (
                                <>
                                  <i className="fa fa-clone mr-1"></i> Copy
                                </>
                              )}
                            </button>
                          </p>
                          <p><strong>Payee:</strong> Advocate Bittoo Sharma</p>
                          <p><strong>Amount:</strong> ₹5,000</p>
                          <ul className="upi-steps-list">
                            <li>1. Open any UPI App and scan this QR code.</li>
                            <li>2. Complete the payment of ₹5,000.</li>
                            <li>3. Copy the 12-digit UPI / UTR Transaction ID.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="form-group mt-3 mb-0">
                        <label className="input-title">UPI Ref / UTR Number *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter 12-digit UPI Transaction / UTR Ref ID"
                          value={upiTransactionId}
                          onChange={(e) => setUpiTransactionId(e.target.value)}
                          required
                        />
                        <small className="hint-text mt-1 d-block">
                          * Please enter the transaction reference / UTR received upon payment for booking confirmation.
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-group mt-3">
                    <button
                      type="submit"
                      className="btn-consult-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Confirm & Pay ₹5,000 (Book 2-Hour Consultation)"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default ConsultationBooking;

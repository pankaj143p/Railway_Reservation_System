import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchBookedTicketByOrderId from "../../services/api/bookedticket";
import { Button } from "../../components/ui/button";

type TicketDetails = {
  ticketNumber: string;
  trainName: string;
  source: string;
  destination: string;
  seatCount: number;
  bookingDate: string;
};

const POLL_INTERVAL = 1000; // 1 second
const MAX_ATTEMPTS = 5;

const Booked = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    const fetchWithRetry = async () => {
      if (!orderId) return;
      try {
        const data = await fetchBookedTicketByOrderId(orderId);
        const ticket = Array.isArray(data) ? data[0] : data;
        if (ticket && ticket.ticketNumber) {
          if (!cancelled) {
            setTicketDetails(ticket);
            setLoading(false);
          }
        } else if (attempts < MAX_ATTEMPTS) {
          attempts++;
          setTimeout(fetchWithRetry, POLL_INTERVAL);
        } else {
          if (!cancelled) {
            setError("Could not fetch ticket details!");
            setLoading(false);
          }
        }
      } catch (err) {
        if (attempts < MAX_ATTEMPTS) {
          attempts++;
          setTimeout(fetchWithRetry, POLL_INTERVAL);
        } else {
          if (!cancelled) {
            setError("Could not fetch ticket details!");
            setLoading(false);
          }
        }
      }
    };

    fetchWithRetry();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <StyledWrapper>
      <div className="container my-24">
        <div className="content">
          <h1 className="thankyou">Thank You!</h1>
          <p className="msg">Your ticket has been <b>successfully booked</b>.</p>
          <p className="info">
            We appreciate your booking with us.<br />
            A confirmation email has been sent to your registered email address.<br />
            Please check your email for ticket details and further instructions.
          </p>
          {loading && <p>Loading ticket details...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && ticketDetails && (
            <>
              <button
                className="show-details-btn"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </button>
              {showDetails && (
                <div className="ticket-details">
                  <p><b>Ticket Number:</b> {ticketDetails.ticketNumber}</p>
                  <p><b>Train Name:</b> {ticketDetails.trainName}</p>
                  <p><b>From:</b> {ticketDetails.source}</p>
                  <p><b>To:</b> {ticketDetails.destination}</p>
                  <p><b>Seats Booked:</b> {ticketDetails.seatCount}</p>
                  <p><b>Booking Date:</b> {ticketDetails.bookingDate}</p>
                </div>
              )}
            </>
          )}
          <div className="footer">
            <div className="home-button">
              <Button onClick={() => navigate("/")}>Go to Home</Button>
            </div>
            <span>Have a safe and pleasant journey!</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;

  .container {
    width: 420px;
    max-width: 99%;
    background-color: #ffffff25;
    border-radius: 15px;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.03);
    border: 0.1px solid rgba(128, 128, 128, 0.178);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    backdrop-filter: blur(20px);
  }

  .content {
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }

  .thankyou {
    font-size: 2.5rem;
    font-weight: 700;
    color: #425981;
    margin-bottom: 18px;
    letter-spacing: 2px;
  }

  .msg {
    font-size: 1.3rem;
    color: #22c55e;
    margin-bottom: 10px;
    font-weight: 600;
  }

  .info {
    color: #425981;
    font-size: 1.05rem;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .show-details-btn {
    background: #5e7eb6;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .show-details-btn:hover {
    background: #425981;
  }

  .ticket-details {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px #0001;
    padding: 16px;
    margin: 16px 0;
    color: #425981;
    font-size: 1rem;
    text-align: left;
    display: inline-block;
  }

  .footer {
    color: #5e7eb6;
    font-size: 1.1rem;
    font-weight: 500;
    margin-top: 10px;
  }

  .home-button {
    margin-bottom: 16px;
  }
`;

export default Booked;
import Ticket from "../../components/ui/Ticket";

const BookingSuccess = () => {
  const pnr = "PNR1234567";
  return (
    <div>
      <h1>Booking Successful!</h1>
      <Ticket pnr={pnr} />
    </div>
  );
};

export default BookingSuccess;
import React from 'react';
import { Navbar } from '../../components/navbar';
import TicketConfirm from '../../components/booking/bookingConform';

const Book = () => {
  return (
   <>
   <Navbar />
   <TicketConfirm onSubmit={function (formData: { fullName: string; seatCount: string; age: string; email: string; date: string; }): void {
          throw new Error('Function not implemented.');
        } } />
   </>
  );
}

export default Book;

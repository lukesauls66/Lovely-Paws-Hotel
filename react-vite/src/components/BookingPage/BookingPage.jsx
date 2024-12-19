import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking, updateBooking, deleteBooking } from './bookingActions';
import bkp from '/BookingPage.module.css'

const BookingPage = (petId) => {
  const dispatch = useDispatch();
  const currentBooking = useSelector(state => state.booking.currentBooking);
  const [loadingSpot, setLoadingSpot] = useState(true);
  const [bookingType, setBookingType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dropOffDate, setDropOffDate] = useState(null);
  const [pickUpDate, setPickUpDate] = useState(null);
  const [dropOffTime, setDropOffTime] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');

  useEffect(() => {
    dispatch(getBookDetailThunk(petId)).finally(() => {
      setLoadingSpot(false);
    });
  }, [petId, dispatch])

  const handleBookingTypeSelection = (type) => {
    setBookingType(type);
    setSelectedDate(null);
    setDropOffDate(null);
    setPickUpDate(null);
  };

  const handleDateSelection = (date) => {
    if (bookingType === 'day-care') {
      setSelectedDate(date);
    } else if (bookingType === 'boarding-care') {
      if (!dropOffDate || (dropOffDate && pickUpDate)) {
        setDropOffDate(date);
        setPickUpDate(null);
      } else {
        setPickUpDate(date);
      }
    }
  };

  const handleSubmit = () => {
    if (bookingType === 'day-care') {
      dispatch(createBooking({ type: bookingType, date: selectedDate, dropOffTime, pickUpTime }));
    } else if (bookingType === 'boarding-care') {
      dispatch(createBooking({ type: bookingType, dropOffDate, pickUpDate, dropOffTime, pickUpTime }));
    }
  };

  return (
    <div>
      <h1 className={bkp.h1}>Book Reservation</h1>
      {currentBooking ? (
        <div className={bkp.currBookContainer}>
          <h2 className={bkp.currBookTitle}>Current Reservation Information</h2>
          <p className={bkp.currBookType}>Type: {currentBooking.type}</p>
          <p className={bkp.currBookDates}>Date(s): {currentBooking.date || `${currentBooking.dropOffDate} - ${currentBooking.pickUpDate}`}</p>
          <button className={bkp.currBookBtnUpdate} onClick={() => dispatch(updateBooking(currentBooking))}>Update</button>
          <button className={bkp.currBookBtnDelete} onClick={() => dispatch(deleteBooking(currentBooking.id))}>Delete</button>
        </div>
      ) : (
        <div className={bkp.bookTypeBtnContainer}>
          <button className={bkp.bookDayCareBtn} onClick={() => handleBookingTypeSelection('day-care')}>Day Care</button>
          <button className={bkp.bookBrdCareBtn} onClick={() => handleBookingTypeSelection('boarding-care')}>Boarding Care</button>
        </div>
      )}

      {bookingType && (
        <div className={bkp.CalenderContainer}>
          <h3 className={bkp.CalenderMainTitle}>Select Dates</h3>
          <div className={bkp.calendar}>
            {/* Implement calendars for current and next month */}
            <p className={bkp.selectDate}>Selected Date: {selectedDate || `${dropOffDate} to ${pickUpDate}`}</p>
            <button className={bkp.selectedDates} onClick={() => handleDateSelection(new Date().toDateString())}>Select a Date</button>
          </div>
        </div>
      )}

      {(selectedDate || (dropOffDate && pickUpDate)) && (
        <div>
          <h3>Select Times</h3>
          <div>
            <label>Drop-Off Time:</label>
            <input type="time" value={dropOffTime} onChange={(e) => setDropOffTime(e.target.value)} />
          </div>
          <div>
            <label>Pick-Up Time:</label>
            <input type="time" value={pickUpTime} onChange={(e) => setPickUpTime(e.target.value)} />
          </div>
        </div>
      )}

      {dropOffTime && pickUpTime && (
        <div>
          <h3>Select Services</h3>
          <p>Implement a list of services here</p>
          <button onClick={handleSubmit}>Submit Booking</button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;

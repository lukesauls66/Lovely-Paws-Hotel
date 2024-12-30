import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Calendar from 'react-calendar';
import * as bookingActions from "../../redux/booking";
import { getAllServices } from "../../redux/service";
import 'react-calendar/dist/Calendar.css';
import bdt from './BookingByDatePage.module.css'

const BookingByDatePage = () => {
  const dispatch = useDispatch();
  const todayBookings = useSelector((state) => state.booking.bookings)
  const servicesStaff = useSelector((state) => state.service.services.services)
  const [selectedDate, setSelectedDate] = useState(null)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setSelectedDate(getFormattedDate(today));
  }, [])

  useEffect(() => {
    if (selectedDate) {
      dispatch(bookingActions.getBookingsByDate(selectedDate))
      dispatch(getAllServices());
    }
  }, [selectedDate, dispatch])

  function getFormattedDate(date) {
    date.setHours(0, 0, 0, 0)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    console.log('formatted date > ', `${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
  }

  const handleDateSelection = (date) => {
    console.log('date > ', date);
    setSelectedDate(getFormattedDate(date))
    console.log('selected date > ', selectedDate);
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (date < today) {
        return bdt.pastDate; // disabling past dates
      }
    }
  }

  // if (!todayBookings || !todayBookings.bookings) {
  //   return <div>Loading...</div>
  // }
  
  
  return (
    <div className={bdt.mainContainer}>
      <h1 className={bdt.h1}>Services by Date</h1>
      <h2 className={bdt.title}>Choose a date to list the services</h2>
      <h2 className={bdt.title}>Selected Date: {selectedDate}</h2>

      <div className={bdt.calendarWrapper}>
        <Calendar
          onChange={handleDateSelection}
          value={selectedDate}
          className={bdt.chosenDate}
          locale="en-US"
          showNeighboringMonth={false}
          minDate={today}
          tileClassName={tileClassName}
        />
      </div>

      {todayBookings && todayBookings.length > 0 && (
        <div className={bdt.serviceByDateContainer}>

          <div className={bdt.listOfPets}>
            {todayBookings.map((book) => (
              <div key={book.id}>
                <p className={bdt.serviceByDateDetail}>
                  Pet Name: {book.pet_id}
                </p>
                <p className={bdt.serviceByDateDetail}>
                  Booking Type: {book.booking_type}
                </p>
                <p className={bdt.serviceByDateDetail}>
                  Drop Off Date and Time: {book.drop_off_date}
                </p>
                <p className={bdt.serviceByDateDetail}>
                  Pick Up Date and Time: {book.pick_up_date}
                </p>
                <p>List of Services:</p>
                  {book.services.map((serve) => (
                    <p key={serve.id}>
                      <p className={bdt.serviceByDateDetail}>{serve.service}</p>
                    </p>
                  ))}
              </div>       
            ))}
          </div>

          <div className={bdt.listOfStaffContainer}>
            {servicesStaff && servicesStaff.length > 0 && (
              <div className={bdt.staffList}>
                {servicesStaff.map((staff) => (
                  <div key={staff.id}>
                    <p>{staff.service}</p>
                    {staff.staff.map((fullName) => (
                      <p key={fullName.id}>{fullName.fname} {fullName.lname}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default BookingByDatePage
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
    const inputDate = new Date(date); // Convert the input date to a Date object
  
    // Ensure valid date input
    if (isNaN(inputDate)) {
      return 'Invalid date'; // Return an error message if the date is invalid
    }
  
    // Format the date into yyyy-MM-dd hh:mm:ss
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(inputDate.getDate()).padStart(2, '0');
    // const hours = String(inputDate.getHours()).padStart(2, '0');
    // const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    // const seconds = String(inputDate.getSeconds()).padStart(2, '0');
  
    // Combine the date and time parts
    const formattedDate = `${year}-${month}-${day}`;
    
    return formattedDate;
  }

  const handleDateSelection = (date) => {
    setSelectedDate(getFormattedDate(date))
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
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Calendar from "react-calendar";
import * as bookingActions from "../../redux/booking";
import { fetchAllPets } from "../../redux/pets";
import "react-calendar/dist/Calendar.css";
import bdt from "./BookingByDatePage.module.css";

const BookingByDatePage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.booking.bookings);
  const pets = useSelector((state) => state.pets.pets);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(null);
  console.log("pets > ", pets);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    setSelectedDate(getFormattedDate(today));
  }, []);

  useEffect(() => {
    if (selectedDate) {
      dispatch(bookingActions.getBookingsByDate(selectedDate));
      dispatch(fetchAllPets());
    }
  }, [selectedDate, dispatch]);

  function getFormattedDate(date) {
    date.setHours(0, 0, 0, 0);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleDateSelection = (date) => {
    setCalendarDate(date);
    setSelectedDate(getFormattedDate(date));
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date < today) {
        return bdt.pastDate; // disabling past dates
      }
    }
  };

  // if (!bookings || !bookings.bookings) {
  //   return <div>Loading...</div>
  // }

  return (
    <div className={bdt.mainContainer}>
      <h1 className={bdt.h1}>Services by Date</h1>
      {/* <img src="/images/paw-bg-strip.png" alt="" className={bdt.pawPicOne} />
      <img src="/images/paw-bg-strip.png" alt="" className={bdt.pawPicTwo} /> */}
      <h2 className={bdt.title}>Choose a date to list the services</h2>
      <h2 className={bdt.title}>Selected Date: {selectedDate}</h2>

      <div className={bdt.calendarWrapper}>
        <Calendar
          onChange={handleDateSelection}
          value={calendarDate}
          className={bdt.chosenDate}
          locale="en-US"
          showNeighboringMonth={false}
          minDate={today}
          tileClassName={tileClassName}
        />
      </div>

      {bookings && bookings.length > 0 && (
        <div className={bdt.serviceByDateContainer}>
          <div className={bdt.listOfPets}>
            {bookings.map((book) => {
              const petName = pets[book.pet_id - 1]?.name;
              return (
                <div key={book.id}>
                  <div className={bdt.petName}>
                    <p className={bdt.serviceByDateDetail}>
                      Pet Name: {petName}
                    </p>
                  </div>
                  <p className={bdt.serviceByDateDetail}>
                    Booking Type: <br /> {book.booking_type}
                  </p>
                  <p className={bdt.serviceByDateDetail}>
                    Drop Off Date and Time: <br /> {book.drop_off_date}
                  </p>
                  <p className={bdt.serviceByDateDetail}>
                    Pick Up Date and Time: <br /> {book.pick_up_date}
                  </p>
                  <p>List of Services:</p>
                  <div className={bdt.servicesList}>
                    {book.services.map((serve) => (
                      <p key={serve.id}>
                        <p className={bdt.serviceByDateDetail}>
                          {serve.service}
                        </p>
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingByDatePage;

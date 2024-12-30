import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import * as bookingActions from "../../redux/booking";
import { getAllServices } from "../../redux/service";
import { fetchPetDetail } from "../../redux/pets";
import bcp from "./BookingCreatePage.module.css";
import "react-calendar/dist/Calendar.css";

const BookingsCreatePage = () => {
  const { petId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const booking = useSelector((state) => state.booking.booking);
  const servicesArr = useSelector((state) => state.service.services.services);
  const pet = useSelector((state) => state.pets.selectedPet);
  const [reload, setReload] = useState(false);
  const [bookingType, setBookingType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isFirstDate, setIsFirstDate] = useState(false);
  const [dropOffDate, setDropOffDate] = useState(null);
  const [pickUpDate, setPickUpDate] = useState(null);
  const [dropOffTime, setDropOffTime] = useState(null);
  const [pickUpTime, setPickUpTime] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isReservationStarted, setIsReservationStarted] = useState(false);
  const [totalCost, setTotalCost] = useState(null);
  const [totalDays, setTotalDays] = useState(null);
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [loadingPetDetails, setLoadingPetDetails] = useState(true);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // useEffect(() => {
  //   dispatch(bookingActions.resetBooking());
  // }, [dispatch])

  useEffect(() => {
    // setIsReservationStarted(false);
    // setTotalCost(null);

    const fetchDetails = async () => {
      try {
        await dispatch(fetchPetDetail(petId));
        setLoadingPetDetails(false);
      } catch (error) {
        console.error("Error fetching pet details:", error);
        setLoadingPetDetails(false);
      }
    };
    fetchDetails();

    // const fetchBooking = async () => {
    //   await dispatch(bookingActions.getBookingByPetId(petId));
    //   console.log('petId', petId);
    //   console.log('booking', booking);
    // };
    // fetchBooking();

    dispatch(bookingActions.getBookingByPetId(petId));
    console.log('petId', petId);
    console.log('booking', booking);

    if (booking) {
      const dropOffDate = new Date(booking.drop_off_date);
      const pickUpDate = new Date(booking.pick_up_date);
      const differenceInMs = pickUpDate - dropOffDate;
      let days;
      if (booking.booking_type === "day_care") {
        days = 1;
      } else {
        days = 1 + Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
      }
      setTotalDays(days);

      if (dropOffDate <= new Date()) {
        setIsReservationStarted(true);
      } else {
        setIsReservationStarted(false);
      }
      const sum = booking?.services?.reduce(
        (acc, el) => acc + Number(el.price),
        0
      );
      const cost = parseFloat(
        (
          Number(sum) +
          days * Number(booking.daily_price)
        ).toFixed(2)
      );
      setTotalCost(cost);
    }
    if (!booking || !booking) {
      dispatch(getAllServices());
    }

    if (isUpdateClicked && booking) {
      const { booking_type, drop_off_date, pick_up_date, services } =
        booking;

      const dropOffDateUtc = new Date(drop_off_date); // This should already be in UTC (ISO string with "Z" at the end)
      const pickUpDateUtc = new Date(pick_up_date); // Similarly for pick-up date

      // Format the time
      const formattedDropOffTime = dropOffDateUtc.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour time format
        timeZone: "UTC", // Ensure time is formatted in UTC
      });

      const formattedPickUpTime = pickUpDateUtc.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "UTC",
      });

      // Set both the Date objects and formatted strings in state
      setBookingType(booking_type);
      setDropOffDate(dropOffDateUtc); // Store the Date object (raw date) for later use
      setPickUpDate(pickUpDateUtc); // Store the Date object
      setSelectedDate(dropOffDateUtc); // Store the Date object
      setDropOffTime(formattedDropOffTime); // Store the formatted drop-off time
      setPickUpTime(formattedPickUpTime); // Store the formatted pick-up time

      const serviceIds = services.map((service) => service.id);
      setSelectedServices(serviceIds);
    }
  }, [petId, dispatch, reload, isUpdateClicked]);

  // useEffect(() => {
  //   if (isUpdateClicked && currentBooking && currentBooking.booking) {
  //     const { booking_type, drop_off_date, pick_up_date, services } =
  //       currentBooking.booking;

  //     const dropOffDateUtc = new Date(drop_off_date); // This should already be in UTC (ISO string with "Z" at the end)
  //     const pickUpDateUtc = new Date(pick_up_date); // Similarly for pick-up date

  //     // Format the date
  //     // const formattedDropOffDate = dropOffDateUtc.toLocaleDateString('en-GB', {
  //     //   weekday: 'short',
  //     //   day: '2-digit',
  //     //   month: 'short',
  //     //   year: 'numeric',
  //     //   timeZone: 'UTC'  // Ensure formatting in UTC
  //     // });

  //     // Format the time
  //     const formattedDropOffTime = dropOffDateUtc.toLocaleTimeString("en-GB", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: true, // Use 12-hour time format
  //       timeZone: "UTC", // Ensure time is formatted in UTC
  //     });

  //     // Format the timezone (GMT offset) and full timezone name
  //     // const timeZoneOffset = dropOffDateUtc.getTimezoneOffset();  // Offset in minutes
  //     // const timezoneOffsetHours = Math.abs(timeZoneOffset / 60);
  //     // const timezoneOffsetMinutes = Math.abs(timeZoneOffset % 60);
  //     // const timezonePrefix = timeZoneOffset > 0 ? '-' : '+';
  //     // const formattedTimeZone = `GMT${timezonePrefix}${String(timezoneOffsetHours).padStart(2, '0')}${String(timezoneOffsetMinutes).padStart(2, '0')}`;

  //     // Format pick-up date and time similarly
  //     // const formattedPickUpDate = pickUpDateUtc.toLocaleDateString('en-GB', {
  //     //   weekday: 'short',
  //     //   day: '2-digit',
  //     //   month: 'short',
  //     //   year: 'numeric',
  //     //   timeZone: 'UTC'
  //     // });

  //     const formattedPickUpTime = pickUpDateUtc.toLocaleTimeString("en-GB", {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: true,
  //       timeZone: "UTC",
  //     });

  //     // Now, combine everything into a final display string (for drop-off)
  //     // const finalFormattedDropOff = `${formattedDropOffDate} ${formattedDropOffTime} ${formattedTimeZone} ${formattedDropOffTime.split(' ')[1]}`;

  //     // Set both the Date objects and formatted strings in state
  //     setBookingType(booking_type);
  //     setDropOffDate(dropOffDateUtc); // Store the Date object (raw date) for later use
  //     setPickUpDate(pickUpDateUtc); // Store the Date object
  //     setSelectedDate(dropOffDateUtc); // Store the Date object
  //     setDropOffTime(formattedDropOffTime); // Store the formatted drop-off time
  //     setPickUpTime(formattedPickUpTime); // Store the formatted pick-up time

  //     // Store formatted date strings as well for display
  //     // setFormattedDropOffDate(formattedDropOffDate);
  //     // setFormattedPickUpDate(formattedPickUpDate);
  //     // setFormattedSelectedDate(formattedDropOffDate);

  //     const serviceIds = services.map((service) => service.id);
  //     setSelectedServices(serviceIds);
  //   }
  // }, [isUpdateClicked, currentBooking]);

  const handleDeleteBooking = async () => {
    await dispatch(bookingActions.deleteBooking(booking.id));
    setBookingType(null);
    setSelectedDate(null);
    setDropOffDate(null);
    setPickUpDate(null);
    setIsFirstDate(false);
    setDropOffTime(null);
    setPickUpTime(null);
    setSelectedServices([]);

    if (reload !== true) {
      setReload(true);
    }

    navigate(`/bookings/pet/${petId}`);
  };

  const handleUpdateBooking = () => {
    setIsUpdateClicked(true);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);

    const formattedDate = date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const combineDateAndTime = (date, time) => {
    console.log("date & time > ", date, time);

    // Split the time into hours and minutes
    const [hours, minutes] = time.split(":");

    // Set the time to the provided date
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    // Format the date and time in the desired format "YYYY-MM-DD HH:mm:ss"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const formattedHours = String(date.getHours()).padStart(2, "0");
    const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
    const formattedSeconds = String(date.getSeconds()).padStart(2, "0");

    // Combine and return the formatted string
    return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date < today) {
        return bcp.pastDate; // Past dates
      }
      if (dropOffDate && date.toDateString() === dropOffDate.toDateString()) {
        return bcp.selectedDate; // Highlight drop-off date
      }
      if (pickUpDate && date.toDateString() === pickUpDate.toDateString()) {
        return bcp.selectedDate; // Highlight pick-up date
      }
      if (
        dropOffDate &&
        pickUpDate &&
        date >= dropOffDate &&
        date <= pickUpDate
      ) {
        return bcp.dateRange; // Highlight range between drop-off and pick-up dates
      }
      if (date.toDateString() === selectedDate?.toDateString()) {
        return bcp.selectedDate; // Highlight selected date (day_care)
      }
    }
    return null; // Default case
  };

  const handleBookingTypeSelection = (type) => {
    setBookingType(type);
    setSelectedDate(null);
    setDropOffDate(null);
    setPickUpDate(null);
    setIsFirstDate(false);
    setDropOffTime(null);
    setPickUpTime(null);
    setSelectedServices([]);
  };

  const handleDateSelection = (date) => {
    if (bookingType === "day_care") {
      setSelectedDate(date);
      setDropOffDate(date);
      setPickUpDate(date);
    } else if (bookingType === "boarding_care") {
      if (!dropOffDate || (dropOffDate && pickUpDate)) {
        setDropOffDate(date);
        setPickUpDate(null);
        setIsFirstDate(true);
      } else {
        setPickUpDate(date);
        setIsFirstDate(false);
      }
    }
    console.log("drop & pick > ", dropOffDate, pickUpDate);
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    const serviceId = parseInt(value);

    if (checked) {
      setSelectedServices((prevSelectedServices) => [
        ...prevSelectedServices,
        serviceId,
      ]);
    } else
      setSelectedServices((prevSelectedServices) =>
        prevSelectedServices.filter((id) => id !== serviceId)
      );
  };

  const handleSubmit = async () => {
    if (loadingPetDetails) {
      console.log("Waiting for pet details");
      return;
    }

    try {
      // await dispatch(fetchPetDetail(petId));

      if (!pet || !pet.owner_id) {
        console.log("Pet details not available.");
        return;
      }

      if (isUpdateClicked) {
        const updateBookingData = {
          id: booking.id,
          client_id: Number(pet.owner_id),
          pet_id: Number(petId),
          booking_type: bookingType,
          drop_off_date: combineDateAndTime(dropOffDate, dropOffTime),
          pick_up_date: combineDateAndTime(pickUpDate, pickUpTime),
          services: selectedServices,
        };
        console.log("update data > ", updateBookingData);
        await dispatch(bookingActions.updateBooking(updateBookingData));
      } else {
        const bookingData = {
          client_id: Number(pet.owner_id),
          pet_id: Number(petId),
          booking_type: bookingType,
          drop_off_date: combineDateAndTime(dropOffDate, dropOffTime),
          pick_up_date: combineDateAndTime(pickUpDate, pickUpTime),
          services: selectedServices,
        };
        await dispatch(bookingActions.createBooking(bookingData));
      }
      setIsUpdateClicked(false);
      if (reload !== true) {
        setReload(true);
      }
      // navigate(`/bookings/pet/${petId}`);
    } catch (error) {
      console.error("Error during booking submission:", error);
    }
  };

  return (
    <div className={bcp.mainContainer}>
      <h1 className={bcp.h1}>Book Reservation</h1>
      {!isUpdateClicked && booking ? (
        <div className={bcp.currBookContainer}>
          <h2 className={bcp.currBookTitle}>Current Reservation Information</h2>
          <p className={bcp.currBookType}>
            Type: {booking.booking_type}
          </p>
          <p className={bcp.currBookDates}>
            Date(s):{" "}
            {booking.date_off_date ||
              `${formatDateTime(
                booking.drop_off_date
              )} - ${formatDateTime(booking.pick_up_date)}`}
          </p>
          <p className={bcp.currBookDates}>Number of Days: {totalDays}</p>
          <div className={bcp.currServicesContainer}>
            <p className={bcp.currServicesDetail}>
              Daily Cost: ${booking.daily_price}
            </p>
            {booking?.services?.map((service) => (
              <div key={service.id}>
                <p className={bcp.currServicesDetail}>
                  {service.service}: ${service.price}
                </p>
              </div>
            ))}
            <h3 className={bcp.currServiceDetail}>Total Cost: ${totalCost}</h3>
          </div>
          {isReservationStarted && (
            <h3 className={bcp.reserveStartedMsg}>
              Reservation has started, cannot Update & Delete
            </h3>
          )}
          <button
            className={bcp.currBookBtnUpdate}
            onClick={handleUpdateBooking}
            disabled={isReservationStarted}
          >
            Update
          </button>
          <button
            className={bcp.currBookBtnDelete}
            onClick={handleDeleteBooking}
            disabled={isReservationStarted}
          >
            Delete
          </button>
        </div>
      ) : (
        <>
          <div className={bcp.bookTypeBtnContainer}>
            <button
              className={bcp.bookDayCareBtn}
              onClick={() => handleBookingTypeSelection("day_care")}
            >
              Day Care
            </button>
            <button
              className={bcp.bookBrdCareBtn}
              onClick={() => handleBookingTypeSelection("boarding_care")}
            >
              Boarding Care
            </button>
          </div>

          <div className={bcp.bookReservationWrapper}>
            {/* Conditional Date Selection Based on Booking Type */}
            {bookingType && (
              <div className={bcp.calendarContainer}>
                <h3 className={bcp.calendarMainTitle}>Select Dates</h3>

                {/* Only show one calendar for day_care */}
                {bookingType === "day_care" && (
                  <div className={bcp.calendarWrapperDayCare}>
                    <Calendar
                      onChange={handleDateSelection}
                      value={selectedDate}
                      className={bcp.calendarDropDate}
                      locale="en-US"
                      showNeighboringMonth={false}
                      minDate={today}
                      tileClassName={tileClassName}
                    />
                  </div>
                )}

                {bookingType === "boarding_care" && (
                  <div className={bcp.calendarContainerBoardingCare}>
                    <h4>Drop-Off and Pick-Up Date</h4>

                    {/* First calendar for current month */}
                    <div className={bcp.calendarWrapperBoardingCare}>
                      <Calendar
                        onChange={handleDateSelection}
                        value={dropOffDate || pickUpDate} // Either drop-off or pick-up can be selected
                        className={bcp.calendarDropOff}
                        locale="en-US"
                        showNeighboringMonth={false}
                        minDate={today}
                        tileClassName={tileClassName} // Apply custom tile classes for past dates and selected date
                      />
                    </div>
                  </div>
                )}

                {/* Show selected dates */}
                <p className={bcp.selectDate}>
                  {bookingType === "day_care"
                    ? `Selected Date: ${
                        selectedDate
                          ? selectedDate.toLocaleDateString()
                          : "None"
                      }`
                    : `Drop-Off Date: ${
                        dropOffDate ? dropOffDate.toLocaleDateString() : "None"
                      } 
                  | Pick-Up Date: ${
                    pickUpDate ? pickUpDate.toLocaleDateString() : "None"
                  }`}
                </p>
              </div>
            )}

            {(selectedDate || (dropOffDate && pickUpDate)) && (
              <div className={bcp.selectTimesContainer}>
                <h3 className={bcp.selectTimesTitle}>Select Times</h3>

                {/* Drop-Off Time Selection */}
                <div className={bcp.dropOffContainer}>
                  <label className={bcp.dropOffTitle}>Drop-Off Time:</label>
                  <select
                    className={bcp.dropOffInput}
                    value={dropOffTime || ""}
                    onChange={(e) => setDropOffTime(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {Array.from({ length: 13 }, (_, i) => 6 + i).map((hour) => (
                      <option
                        key={hour}
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pick-Up Time Selection */}
                <div className={bcp.pickUpContainer}>
                  <label className={bcp.pickUpTitle}>Pick-Up Time:</label>
                  <select
                    className={bcp.pickUpInput}
                    value={pickUpTime || ""}
                    onChange={(e) => setPickUpTime(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {Array.from({ length: 12 }, (_, i) => 7 + i).map((hour) => (
                      <option
                        key={hour}
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {dropOffTime && pickUpTime && (
              <div className={bcp.serviceListContainer}>
                <h3 className={bcp.serviceListTitle}>Select Services</h3>
                <p>Need to choose at least of the services</p>
                <div>
                  {servicesArr.map((service) => (
                    <div key={service.id}>
                      <input
                        type="checkbox"
                        id={`service-${service.id}`}
                        name="service"
                        value={service.id}
                        checked={selectedServices.includes(service.id)}
                        onChange={handleServiceChange}
                      />
                      <label htmlFor={`service-${service.id}`}>
                        {service.service}
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  className={bcp.submitButton}
                  onClick={() => handleSubmit()}
                  disabled={isFirstDate || selectedServices.length === 0}
                >
                  Submit Booking
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsCreatePage;

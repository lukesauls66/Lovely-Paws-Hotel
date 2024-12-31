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


  // Effect to fetch pet details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoadingPetDetails(true);
        await dispatch(fetchPetDetail(petId));
        setLoadingPetDetails(false);
      } catch (error) {
        console.error("Error fetching pet details:", error);
        setLoadingPetDetails(false);
      }
    };
    fetchDetails();
  }, [petId, dispatch]);

  // Effect to fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoadingPetDetails(true);
        await dispatch(bookingActions.getBookingByPetId(petId));
        setLoadingPetDetails(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoadingPetDetails(false);
      }
    };
    fetchBooking();
  }, [petId, dispatch]); // Only run when petId changes

  // Effect for handling booking once fetched
  useEffect(() => {
    if (booking) {
      const dropOffDate = new Date(booking?.drop_off_date);
      const pickUpDate = new Date(booking?.pick_up_date);
      const differenceInMs = pickUpDate - dropOffDate;
      let days;
      if (booking?.booking_type === "day_care") {
        days = 1;
      } else {
        days = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
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
        (Number(sum) + days * Number(booking?.daily_price)).toFixed(2)
      );
      setTotalCost(cost);
    }
  }, [booking]); // Only run when booking state is updated

  // Effect to fetch services if booking is not available
  useEffect(() => {
    if (!booking) {
      dispatch(getAllServices());
    }
  }, [booking, dispatch]); // Only fetch services if booking is not set

  // Effect for handling updates
  useEffect(() => {
    if (isUpdateClicked && booking) {
      const { booking_type, drop_off_date, pick_up_date, services } = booking;

      const timeZoneOffsetInMinutes = new Date().getTimezoneOffset();
      const timeZoneOffsetInHours = timeZoneOffsetInMinutes / 60

      const newDateDropOff = new Date(drop_off_date);
      const formattedDropOffTime = newDateDropOff.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 12-hour time format
        timeZone: "UTC", // Ensure time is formatted in UTC
      });
      newDateDropOff.setHours(newDateDropOff.getHours() + timeZoneOffsetInHours);

      const newDatePickUp = new Date(pick_up_date);
      const formattedPickUpTime = newDatePickUp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
      newDatePickUp.setHours(newDatePickUp.getHours() + timeZoneOffsetInHours);

      setBookingType(booking_type);
      setDropOffDate(newDateDropOff); // Store the Date object (raw date) for later use
      setPickUpDate(newDatePickUp); // Store the Date object
      setSelectedDate(newDateDropOff); // Store the Date object
      setDropOffTime(formattedDropOffTime); // Store the formatted drop-off time
      setPickUpTime(formattedPickUpTime); // Store the formatted pick-up time

      const serviceIds = services.map((service) => service.id);
      setSelectedServices(serviceIds);
    }
  }, [isUpdateClicked, booking]); // Run when either isUpdateClicked or booking changes


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
      return;
    }

    try {
      await dispatch(fetchPetDetail(petId));

      if (!pet || !pet.owner_id) {
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
      dispatch(bookingActions.getBookingByPetId(petId));
      navigate(`/bookings/pet/${petId}`);
    } catch (error) {
      console.error("Error during booking submission:", error);
    }
  };

  return (
    <>
    {loadingPetDetails ? (
      <div className={bcp.loading}>Loading...</div>
    ) : (
      <div className={bcp.mainContainer}>
        <h1 className={bcp.h1}>Book Reservation</h1>
        <h2 className={bcp.petName}>Name: {pet.name}</h2>
        {!isUpdateClicked && booking ? (
          <div className={bcp.currBookContainer}>
            <h2 className={bcp.currBookTitle}>Current Reservation Information</h2>
            <p className={bcp.currBookType}>Type: {booking.booking_type}</p>
            <p className={bcp.currBookDates}>
              Date(s):{" "}
              {booking.date_off_date ||
                `${formatDateTime(booking.drop_off_date)} - ${formatDateTime(
                  booking.pick_up_date
                )}`}
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
    )}
    </>
  );
};

export default BookingsCreatePage;

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
  }, [petId, dispatch]);

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
  }, [booking]);

  useEffect(() => {
    if (!booking) {
      dispatch(getAllServices());
    }
  }, [booking, dispatch]);

  useEffect(() => {
    if (isUpdateClicked && booking) {
      const { booking_type, drop_off_date, pick_up_date, services } = booking;

      const timeZoneOffsetInMinutes = new Date().getTimezoneOffset();
      const timeZoneOffsetInHours = timeZoneOffsetInMinutes / 60;

      const newDateDropOff = new Date(drop_off_date);
      newDateDropOff.setMinutes(0);
      const formattedDropOffTime = newDateDropOff.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
      newDateDropOff.setHours(
        newDateDropOff.getHours() + timeZoneOffsetInHours
      );

      const newDatePickUp = new Date(pick_up_date);
      newDatePickUp.setMinutes(0);
      const formattedPickUpTime = newDatePickUp.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      });
      newDatePickUp.setHours(newDatePickUp.getHours() + timeZoneOffsetInHours);

      setBookingType(booking_type);
      setDropOffDate(newDateDropOff);
      setPickUpDate(newDatePickUp);
      setSelectedDate(newDateDropOff);
      setDropOffTime(formattedDropOffTime);
      setPickUpTime(formattedPickUpTime);

      const serviceIds = services.map((service) => service.id);
      setSelectedServices(serviceIds);
    }
  }, [isUpdateClicked, booking]);

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
    const [hours, minutes] = time.split(":");

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedHours = String(date.getHours()).padStart(2, "0");
    const formattedMinutes = String(date.getMinutes()).padStart(2, "0");
    const formattedSeconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date < today) {
        return bcp.pastDate;
      }
      if (dropOffDate && date.toDateString() === dropOffDate.toDateString()) {
        return bcp.selectDate;
      }
      if (pickUpDate && date.toDateString() === pickUpDate.toDateString()) {
        return bcp.selectDate;
      }

      if (dropOffDate && pickUpDate) {
        const startDate = dropOffDate < pickUpDate ? dropOffDate : pickUpDate;
        const endDate = dropOffDate < pickUpDate ? pickUpDate : dropOffDate;

        if (date >= startDate && date <= endDate) {
          if (date.getDay() === 0 || date.getDay() === 6) {
            return bcp.weekendInRange;
          }
          return bcp.dateRange;
        }
      }

      if (date.toDateString() === selectedDate?.toDateString()) {
        return bcp.selectDate;
      }
    }
    return null;
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
        if (date <= dropOffDate) {
          alert(
            "Pick-Up Date must be after Drop-Off Date or click the Boarding Care again"
          );
          setPickUpDate(null);
        } else {
          setPickUpDate(date);
          setIsFirstDate(false);
        }
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
              <h2 className={bcp.currBookTitle}>
                Current Reservation Information
              </h2>
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
                <h3 className={bcp.currServiceDetail}>
                  Total Cost: ${totalCost}
                </h3>
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
                  className={bcp.bookBtn}
                  onClick={() => handleBookingTypeSelection("day_care")}
                >
                  Day Care
                </button>
                <button
                  className={bcp.bookBtn}
                  onClick={() => handleBookingTypeSelection("boarding_care")}
                >
                  Boarding Care
                </button>
              </div>

              <div className={bcp.bookReservationWrapper}>
                {bookingType && (
                  <div className={bcp.calendarContainer}>
                    <div className={bcp.h3Div}>
                      <h3 className={bcp.calendarMainTitle}>Select Dates</h3>
                    </div>

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
                        <div className={bcp.h3Div}>
                          <h3>Drop-Off and Pick-Up Date</h3>
                        </div>

                        <div className={bcp.calendarWrapperBoardingCare}>
                          <Calendar
                            onChange={handleDateSelection}
                            value={dropOffDate || pickUpDate}
                            className={bcp.calendarDropOff}
                            locale="en-US"
                            showNeighboringMonth={false}
                            minDate={today}
                            tileClassName={tileClassName}
                          />
                        </div>
                      </div>
                    )}

                    <div className={bcp.dateCofirmation}>
                      <p className={bcp.selectionDate}>
                        {bookingType === "day_care" ? (
                          `Selected Date: ${
                            selectedDate
                              ? selectedDate.toLocaleDateString()
                              : "None"
                          }`
                        ) : (
                          <>
                            {`Drop-Off Date: ${
                              dropOffDate
                                ? dropOffDate.toLocaleDateString()
                                : "None"
                            }`}
                            <br />
                            <br />
                            {`Pick-Up Date: ${
                              pickUpDate
                                ? pickUpDate.toLocaleDateString()
                                : "None"
                            }`}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {(selectedDate || (dropOffDate && pickUpDate)) && (
                  <div className={bcp.selectTimesContainer}>
                    <div className={bcp.h3Div}>
                      <h3 className={bcp.selectTimesTitle}>Select Times</h3>
                    </div>
                    <div className={bcp.timeOptions}>
                      <div className={bcp.dropOffContainer}>
                        <label className={bcp.dropOffTitle}>
                          Drop-Off Time:
                        </label>
                        <select
                          className={bcp.dropOffInput}
                          value={dropOffTime || ""}
                          onChange={(e) => setDropOffTime(e.target.value)}
                        >
                          <option value="" disabled>
                            Select a time
                          </option>
                          {Array.from({ length: 13 }, (_, i) => 6 + i).map(
                            (hour) => (
                              <option
                                key={hour}
                                value={`${hour.toString().padStart(2, "0")}:00`}
                              >
                                {`${hour.toString().padStart(2, "0")}:00`}
                              </option>
                            )
                          )}
                        </select>
                      </div>

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
                          {Array.from({ length: 12 }, (_, i) => 7 + i).map(
                            (hour) => (
                              <option
                                key={hour}
                                value={`${hour.toString().padStart(2, "0")}:00`}
                              >
                                {`${hour.toString().padStart(2, "0")}:00`}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {dropOffTime && pickUpTime && (
                  <div className={bcp.serviceListContainer}>
                    <div className={bcp.h3Div}>
                      <h3 className={bcp.serviceListTitle}>Select Services</h3>
                    </div>
                    <div className={bcp.innerServiceListContainer}>
                      <div className={bcp.servicesOptions}>
                        <p>Need to choose at least one of the services</p>
                        <div className={bcp.checkboxList}>
                          {servicesArr.map((service) => (
                            <label key={service.id}>
                              <input
                                type="checkbox"
                                id={`service-${service.id}`}
                                name="service"
                                value={service.id}
                                checked={selectedServices.includes(service.id)}
                                onChange={handleServiceChange}
                              />
                              <span></span>
                              {service.service}
                            </label>
                          ))}
                        </div>
                      </div>
                      <button
                        className={bcp.submitButton}
                        onClick={() => handleSubmit()}
                        disabled={isFirstDate || selectedServices.length === 0}
                      >
                        Submit Booking
                      </button>
                    </div>
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

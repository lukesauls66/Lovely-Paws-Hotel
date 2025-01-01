import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as bookingActions from "../../redux/booking";
import * as sessionActions from "../../redux/session";
import * as petActions from "../../redux/pets";
import book from "./AllBookingsPage.module.css";

function AllBookingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [clients, setClients] = useState({});
  const [pets, setPets] = useState({});
  const { bookings, loading, errors } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(bookingActions.getAllBookings());
  }, [dispatch]);

  useEffect(() => {
    const fetchClientsAndPets = async () => {
      const clientsMap = {};
      const petsMap = {};
      for (const booking of bookings) {
        const user = await dispatch(
          sessionActions.getUserById(booking.client_id)
        );
        if (user.payload) {
          clientsMap[booking.client_id] = user.payload;
        }
      }
      for (const booking of bookings) {
        const pet = await dispatch(petActions.fetchPetDetail(booking.pet_id));
        if (pet.payload) {
          petsMap[booking.pet_id] = pet.payload;
        }
      }
      setClients(clientsMap);
      setPets(petsMap);
    };

    if (bookings?.length) {
      fetchClientsAndPets();
    }
  }, [bookings, dispatch]);

  const handleDeleteBooking = async (id) => {
    await dispatch(bookingActions.deleteBooking(id));
    dispatch(bookingActions.getAllBookings());
  };

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  return (
    <div className={book.mainContainer}>
      {bookings?.length > 0 ? (
        <div className={book.innerContainer}>
          {bookings.map((booking) => {
            const client = clients[booking.client_id];
            const pet = pets[booking.pet_id];

            return (
              <div className={book.individualBookingContainer} key={booking.id}>
                <div className={book.infoContainer}>
                  <p className={book.infoTitle}>Daycare or Boarding Care:</p>
                  <p>{booking.booking_type}</p>
                </div>
                <div className={book.infoContainer}>
                  <p className={book.infoTitle}>Owner:</p>
                  {client ? (
                    <p>
                      {client.fname} {client.lname}
                    </p>
                  ) : (
                    <p>Loading Client...</p>
                  )}
                </div>
                {pet ? (
                  <div className={book.petsInfo}>
                    <div className={book.infoContainer}>
                      <p className={book.infoTitle}>Pet Name:</p>
                      <p>{pet.name}</p>
                    </div>
                    {pet.dietary_note ? (
                      <div className={book.infoContainer}>
                        <p className={book.infoTitle}>Dietary Notes:</p>
                        <p>{pet.dietary_note}</p>
                      </div>
                    ) : (
                      <div className={book.infoContainer}>
                        <p className={book.infoTitle}>Dietary Notes:</p>
                        <p>N/A</p>
                      </div>
                    )}
                    {pet.medication_note ? (
                      <div className={book.infoContainer}>
                        <p className={book.infoTitle}>Medication Notes:</p>
                        <p>{pet.medication_note}</p>
                      </div>
                    ) : (
                      <div className={book.infoContainer}>
                        <p className={book.infoTitle}>Medication Notes:</p>
                        <p>N/A</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Loading Pet...</p>
                )}
                <div className={book.infoContainer}>
                  <p className={book.infoTitle}>Drop Off:</p>
                  <p>{booking.drop_off_date}</p>
                </div>
                <div className={book.infoContainer}>
                  <p className={book.infoTitle}>Pick Up:</p>
                  <p>{booking.pick_up_date}</p>
                </div>
                <div className={book.buttonContainer}>
                  <button
                    className={book.updateAndDeleteButtons}
                    onClick={() => navigate(`/bookings/pet/${booking.pet_id}`)}
                  >
                    Update
                  </button>
                  <button
                    className={book.updateAndDeleteButtons}
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No bookings available</div>
      )}
    </div>
  );
}

export default AllBookingsPage;

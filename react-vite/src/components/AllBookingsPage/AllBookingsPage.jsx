import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as bookingActions from "../../redux/booking";
import * as sessionActions from "../../redux/session";

function AllBookingsPage() {
  const dispatch = useDispatch();
  const [clients, setClients] = useState({});
  const { bookings, loading, errors } = useSelector((state) => state.booking);
  console.log("clients:", clients);

  useEffect(() => {
    dispatch(bookingActions.getAllBookings());
  }, [dispatch]);

  useEffect(() => {
    const fetchClients = async () => {
      const clientsMap = {};
      for (const booking of bookings) {
        const user = await dispatch(
          sessionActions.getUserById(booking.client_id)
        );
        if (user.payload) {
          clientsMap[booking.client_id] = user.payload;
        }
      }
      setClients(clientsMap);
    };

    if (bookings?.length) {
      fetchClients();
    }
  }, [bookings, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  return (
    <div>
      {bookings?.length > 0 ? (
        <div>
          {bookings.map((booking) => {
            const client = clients[booking.client_id];

            return (
              <div key={booking.id}>
                <div>
                  <p>Daycare or Boarding Care:</p>
                  <br />
                  <p>{booking.booking_type}</p>
                </div>
                <div>
                  <p>Client:</p>
                  <br />
                  {client ? (
                    <p>
                      {client.fname} {client.lname}
                    </p>
                  ) : (
                    <p>Loading Client...</p>
                  )}
                </div>
                <div>
                  <p>Daycare or Boarding Care:</p>
                  <br />
                  <p>{booking.booking_type}</p>
                </div>
                <div>
                  <p>Daycare or Boarding Care:</p>
                  <br />
                  <p>{booking.booking_type}</p>
                </div>
                <div>
                  <p>Daycare or Boarding Care:</p>
                  <br />
                  <p>{booking.booking_type}</p>
                </div>
                <div>
                  <p>Daycare or Boarding Care:</p>
                  <br />
                  <p>{booking.booking_type}</p>
                </div>
                <div>
                  <p>Daily Pic:</p>
                  <br />
                  <p>{booking.daily_pic}</p>
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

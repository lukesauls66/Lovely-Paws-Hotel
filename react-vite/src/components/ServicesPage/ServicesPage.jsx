import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as serviceActions from "../../redux/service";
import serv from "./ServicesPage.module.css";

function ServicesPage() {
  const dispatch = useDispatch();
  const { services, loading, errors } = useSelector(
    (state) => state.service.services
  );
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(serviceActions.getAllServices());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  const isOwnerorManager =
    sessionUser?.position === "Manager" || sessionUser?.position === "Owner";

  return (
    <div>
      <div>
        {services?.length > 0 ? (
          <div className={serv.allServicesContainer}>
            {services.map((service) => {
              return (
                <div key={service.id} className={serv.serviceContainer}>
                  <div>
                    {service.service}, {service.price}
                  </div>
                  <div>
                    {service.staff.map((member) => {
                      return (
                        <div key={member.id}>
                          {member.fname} {member.lname}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No services available</div>
        )}
      </div>
      {isOwnerorManager && <button>Create a Service</button>}
    </div>
  );
}

export default ServicesPage;

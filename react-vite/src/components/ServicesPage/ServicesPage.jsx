import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as serviceActions from "../../redux/service";
import service from "./ServicesPage.module.css";

function ServicesPage() {
  const dispatch = useDispatch();
  const { services, loading, errors } = useSelector(
    (state) => state.service.services
  );

  useEffect(() => {
    dispatch(serviceActions.getAllServices());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  return (
    <div>
      {services?.length > 0 ? (
        <div className={service.allServicesContainer}>
          {services.map((service) => {
            return (
              <div key={service.id} className={service.serviceContainer}>
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
  );
}

export default ServicesPage;

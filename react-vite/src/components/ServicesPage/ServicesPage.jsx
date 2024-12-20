import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as serviceActions from "../../redux/service";
import CreateServiceForm from "../CreateServiceModal";
import serv from "./ServicesPage.module.css";

function ServicesPage() {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const { services, loading, errors } = useSelector(
    (state) => state.service.services
  );
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(serviceActions.getAllServices());

    async function fetchStaff() {
      const res = await fetch("/api/users/staff");
      const data = await res.json();
      setStaffList(data.staff);
    }
    fetchStaff();
  }, [dispatch]);
  console.log("staff: ", staffList);

  const handleCreateService = async (newService) => {
    await dispatch(serviceActions.createNewService(newService));
    dispatch(serviceActions.getAllServices());
  };

  const handleUpdateService = async (updatedService) => {
    await dispatch(serviceActions.updateService(updatedService));
    dispatch(serviceActions.getAllServices());
    setIsFormOpen(false);
    setSelectedService(null);
  };

  const handleUpdate = (service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    await dispatch(serviceActions.deleteService(serviceId));
    dispatch(serviceActions.getAllServices());
  };

  const isOwnerorManager =
    sessionUser?.position === "Manager" || sessionUser?.position === "Owner";

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

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
                  <button onClick={() => handleUpdate(service)}>Update</button>
                  <button onClick={() => handleDeleteService(service.id)}>
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No services available</div>
        )}
      </div>
      {isOwnerorManager && (
        <button onClick={() => setIsFormOpen(true)}>Create a Service</button>
      )}
      <CreateServiceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedService(null);
        }}
        onSubmit={selectedService ? handleUpdateService : handleCreateService}
        staffList={staffList}
        service={selectedService}
      />
    </div>
  );
}

export default ServicesPage;

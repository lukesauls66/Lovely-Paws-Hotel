import { useState, useEffect } from "react";
import servform from "./CreateServiceForm.module.css";

function CreateServiceForm({ isOpen, onClose, onSubmit, staffList, service }) {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    if (service) {
      setServiceName(service.service);
      setPrice(service.price);
      setSelectedStaff(service.staff?.map((staff) => staff.id));
    } else {
      setServiceName("");
      setPrice("");
      setSelectedStaff([]);
    }
  }, [service]);

  useEffect(() => {
    if (!isOpen) {
      setServiceName("");
      setPrice("");
      setSelectedStaff([]);
    }
  }, [isOpen]);

  const handleCheckbox = (staffId) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedService = {
      id: service?.id || null,
      service: serviceName,
      price: parseFloat(price),
      staff: selectedStaff,
    };
    onSubmit(submittedService);

    setServiceName("");
    setPrice("");
    setSelectedStaff([]);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={servform.formContainer}>
      <div className={servform.formContent}>
        <button className={servform.closeButton} onClick={onClose}>
          &times;
        </button>
        <h1>{service ? "Update Service" : "Create New Service"}</h1>
        <form onSubmit={handleSubmit}>
          <div className={servform.formLabelContainer}>
            <label htmlFor="serviceName">Service Name</label>
            <input
              id="serviceName"
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>
          <div className={servform.formLabelContainer}>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className={servform.formLabelContainer}>
            <label>Staff</label>
            <div className={servform.staffCheckboxes}>
              {staffList?.map((staff) => {
                return (
                  <div key={staff.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={staff.id}
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => handleCheckbox(staff.id)}
                      />
                      {staff.fname} {staff.lname}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <button className={servform.createServiceButton} type="submit">
            {service ? "Update Service" : "Create Service"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateServiceForm;

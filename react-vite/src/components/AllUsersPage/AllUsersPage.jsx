import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as userActions from "../../redux/user";
import use from "./AllUsersPage.module.css";

function AllUsersPage() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user.users);
  const currentUser = useSelector((state) => state.session.user);
  console.log("CurrUser: ", currentUser);

  useEffect(() => {
    dispatch(userActions.getAllUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  const clients = users?.filter((user) => !user.position);
  const employees = users?.filter((user) => user.position === "Employee");
  const managers = users?.filter((user) => user.position === "Manager");

  const isOwnerOrManager =
    currentUser?.position === "Manager" || currentUser?.position === "Owner";

  return (
    <div className={use.mainPageContainer}>
      {isOwnerOrManager ? (
        users?.length > 0 ? (
          <div className={use.mainUsersContainer}>
            <div className={use.allClientsContainer}>
              <h2>Clients</h2>
              {clients.length > 0 ? (
                clients.map((user) => (
                  <div className={use.userContainer} key={user.id}>
                    <div className={use.name}>
                      <p className={use.ptags}>Name:</p>
                      {user.fname} {user.lname}
                    </div>
                    <div className={use.email}>
                      <p className={use.ptags}>Email:</p>
                      {user.email}
                    </div>
                    <div className={use.phoneNum}>
                      <p className={use.ptags}>Phone Number:</p>
                      {user.phone_num}
                    </div>
                  </div>
                ))
              ) : (
                <p>No clients available</p>
              )}
            </div>
            <div className={use.allEmployeesContainer}>
              <h2>Employees</h2>
              {employees.length > 0 ? (
                employees.map((user) => (
                  <div className={use.userContainer} key={user.id}>
                    <div className={use.name}>
                      <p className={use.ptags}>Name:</p>
                      {user.fname} {user.lname}
                    </div>
                    <div className={use.email}>
                      <p className={use.ptags}>Email:</p>
                      {user.email}
                    </div>
                    <div className={use.phoneNum}>
                      <p className={use.ptags}>Phone Number:</p>
                      {user.phone_num}
                    </div>
                  </div>
                ))
              ) : (
                <p>No employees available</p>
              )}
            </div>
            <div className={use.allManagersContainer}>
              <h2>Managers</h2>
              {managers.length > 0 ? (
                managers.map((user) => (
                  <div className={use.userContainer} key={user.id}>
                    <div className={use.name}>
                      <p className={use.ptags}>Name:</p>
                      {user.fname} {user.lname}
                    </div>
                    <div className={use.email}>
                      <p className={use.ptags}>Email:</p>
                      {user.email}
                    </div>
                    <div className={use.phoneNum}>
                      <p className={use.ptags}>Phone Number:</p>
                      {user.phone_num}
                    </div>
                  </div>
                ))
              ) : (
                <p>No managers available</p>
              )}
            </div>
          </div>
        ) : (
          <div>No users available</div>
        )
      ) : (
        <div>Unauthorized</div>
      )}
    </div>
  );
}

export default AllUsersPage;

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as userActions from "../../redux/user";
import use from "./AllUsersPage.module.css";

function AllUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, errors } = useSelector((state) => state.user.users);

  useEffect(() => {
    dispatch(userActions.getAllUsers());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (errors) return <div>Error: {errors}</div>;

  const clients = users?.filter((user) => !user.position);
  const employees = users?.filter((user) => user.position === "Employee");
  const managers = users?.filter((user) => user.position === "Manager");

  return (
    <div>
      {users?.length > 0 ? (
        <div className={use.mainUsersContainer}>
          <div className={use.allClientsContainer}>
            <h2>Clients</h2>
            {clients.length > 0 ? (
              clients.map((user) => (
                <div className={use.userContainer} key={user.id}>
                  {user.fname} {user.lname}
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
                  {user.fname} {user.lname}
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
                  {user.fname} {user.lname}
                </div>
              ))
            ) : (
              <p>No managers available</p>
            )}
          </div>
          {/* {users.map((user) => {
            return (
              <div className={use.userContainer} key={user.id}>
                <p>
                  {user.fname} {user.lname}
                </p>
                {user.position ? <p>{user.position}</p> : null}
              </div>
            );
          })} */}
        </div>
      ) : (
        <div>No users available</div>
      )}
    </div>
  );
}

export default AllUsersPage;

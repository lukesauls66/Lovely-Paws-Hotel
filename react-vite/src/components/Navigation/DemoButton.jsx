import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/session';
import DemoButtonStyles from './DemoButton.module.css';

const demoUsers = [
  { username: 'demo-client', email: 'demo-client@example.com', password: 'password' },
  { username: 'demo-employee', email: 'demo-employee@example.com', password: 'password' },
  { username: 'demo-manager', email: 'demo-manager@example.com', password: 'password' },
  { username: 'demo-owner', email: 'demo-owner@example.com', password: 'password' },
];

const DemoButton = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDemoLogin = (email, password) => {
    dispatch(login({ email, password }));
    setIsDropdownOpen(false); 
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className={DemoButtonStyles.demoButton}>
      <button className={DemoButtonStyles.dropdownButton} onClick={toggleDropdown}>
        Demo
      </button>
      {isDropdownOpen && (
        <div className={DemoButtonStyles.dropdownContent}>
          {demoUsers.map((user) => (
            <button key={user.username} onClick={() => handleDemoLogin(user.email, user.password)}>
              {user.username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DemoButton;
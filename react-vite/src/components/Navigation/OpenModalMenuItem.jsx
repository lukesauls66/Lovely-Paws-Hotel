import { useModal } from '../../context/Modal';
import profile from './ProfileButton.module.css'

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the button that opens the modal
  onItemClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <li onClick={onClick}>
      <button className={profile.modalButton}>{itemText}</button>
    </li>
  );
}

export default OpenModalMenuItem;

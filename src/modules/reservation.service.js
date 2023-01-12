import renderReservationPopup from './reservation.controller.js';

const reservations = () => {
  const reserveButtons = document.querySelectorAll('.reservation');
  reserveButtons.forEach((reserveBu) => {
    reserveBu.addEventListener('click', renderReservationPopup);
  });
};

export default reservations;
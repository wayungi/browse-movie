import DEFAULT from '../../config/default.js';
import reservationCounter from './reservation.counter.js';

const closeModal = () => {
  document.querySelector('body').removeChild(document.querySelector('.popup-container'));
};

const createReservationsMarkup = (reservations) => {
  let markup = '';
  reservations.forEach((reservation) => {
    markup += `<li>${reservation.date_start} - ${reservation.date_end} by ${reservation.username}</li>`;
  });
  return markup;
};

const clearReservationForm = () => {
  document.querySelector('#username').value = '';
  document.querySelector('#date-start').value = '';
  document.querySelector('#date-end').value = '';
};

const reserve = async (e) => {
  e.preventDefault();
  const movieId = parseInt(e.target.id.split('_')[1], 10);
  const username = e.target.querySelector('#username').value;
  const dateStart = e.target.querySelector('#date-start').value;
  const dateEnd = e.target.querySelector('#date-end').value;

  const dataObj = {
    item_id: `${movieId}`,
    username,
    date_start: dateStart,
    date_end: dateEnd,
  };

  const URL = `${DEFAULT.INVOLVEMENT_API_BASEURL}/reservations/`;
  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify(dataObj),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  if (response.ok) {
    reservationCounter.updateCounter();

    const reserveContainer = document.querySelector('.reserve-popup .reservations ul');
    const newItem = document.createElement('li');
    newItem.innerHTML = createReservationsMarkup([dataObj]);

    reserveContainer.appendChild(newItem);
    reserveContainer.previousElementSibling.innerHTML = `Reservations(${reservationCounter.length})`;
    clearReservationForm();
  }
};

const renderReservationPopup = async (e) => {
  const movieId = parseInt(e.target.id.split('_')[1], 10);
  const response = await fetch(`${DEFAULT.MOVE_API_URL}/${movieId}`);
  const movie = await response.json();
  const result = await fetch(`${DEFAULT.INVOLVEMENT_API_BASEURL}/reservations?item_id=${movieId}`);
  const reservations = result.ok ? await result.json() : [];

  reservationCounter.init(reservations);

  const reservePopup = document.createElement('div');
  reservePopup.classList.add('popup-container');

  reservePopup.innerHTML = `
                            <div class="reserve-popup">
                              <div class="item-details">
                                <img src=${movie.image.medium} alt="" class="movie-img  "/>
                                <span class="material-symbols-outlined close">close</span>
                                <h2>${movie.name}</h2>
                                <ul>
                                  <li><span class="caption">Premiered:</span> ${movie.premiered}</li>
                                  <li><span class="caption">Rating:</span> ${movie.rating.average}</li>
                                  <li><span class="caption">Runtime:</span> ${movie.averageRuntime}</li>
                                  <li><span class="caption">Genres:</span> ${movie.genres.join(', ')}</li>
                                </ul>
                              </div>
                              
                              <div class="reservations">
                                <h2>Reservations(${reservationCounter.length})</h2>
                                <ul>
                                  ${createReservationsMarkup(reservations) || '<li>This movie has no reservation yet</li>'}
                                </ul>
                              </div>

                              <form class="add-reservation" id="add-reservation_${movieId}">
                                <h2>Add a reservation</h2>
                                <input type="text" id="username" placeholder="Enter your name" required>
                                <input type="date" id="date-start" required>
                                <input type="date" id="date-end" required>
                                <input type="submit" value="Reserve">
                              </form>
                            </div>
                          
                          `;

  document.querySelector('body').appendChild(reservePopup);

  document.querySelector('.material-symbols-outlined.close').addEventListener('click', closeModal);
  document.querySelector('.reserve-popup .add-reservation').addEventListener('submit', reserve);
};

export default renderReservationPopup;
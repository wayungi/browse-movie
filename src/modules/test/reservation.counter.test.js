import reservationCounter from '../reservation.counter.js';

describe('Test reservation counter', () => {
  const initialReservations = [];
  reservationCounter.init(initialReservations);

  test('update method call increases counter by 1', () => {
    reservationCounter.updateCounter();

    expect(reservationCounter.length).toBe(1);
  });

  test('A second call to update makes counter 2', () => {
    reservationCounter.updateCounter();

    expect(reservationCounter.length).toBe(2);
  });
});
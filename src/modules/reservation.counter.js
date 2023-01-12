class ReservationCounter {
  constructor() {
    this.length = 0;
  }

  init(nodeList) {
    this.length = nodeList.length;
  }

  updateCounter() {
    this.length += 1;
  }
}

const reservationCounter = new ReservationCounter();
export default reservationCounter;
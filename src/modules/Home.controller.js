import defaultConfig from '../../config/default.js';
import { getLike } from './Likes.js';
import MovieCounter from './Home.counter.js';

const getMoviewithLikeList = (movies, likes) => {
  // - TODO: if there is no like just send the default data
  if (!likes.length) return movies;
  //  TODO: if there is append the data
  likes.forEach((element) => {
    const index = movies.findIndex((movie) => movie.id === element.item_id);
    if (index !== -1) movies[index].likes = element.likes;
  });
  return likes;
};

export const homeMovieCounter = () => {
  const movieCounter = document.querySelectorAll('.card');
  const movieItems = MovieCounter(movieCounter);
  const displayMovieCounter = document.querySelector('#movie-counter');
  displayMovieCounter.innerHTML = `Movies(${movieItems})`;
};

export const getMovieHandler = async () => {
  try {
    const moveList = await fetch(defaultConfig.MOVE_API_URL);
    const likeList = await getLike();
    const movieListsJson = await moveList.json();
    getMoviewithLikeList(movieListsJson, likeList);
    return movieListsJson;
  } catch (error) {
    throw new Error(error);
  }
};

// - TODO: SET AND GET IN LOCAL STORAGE
export const get = (key) => JSON.parse(localStorage.getItem(key));
export const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
// - TODO: SET AND GET CURRENT ACTIVE DATA
const currentData = (data) => {
  const currentPage = get('currentPage') || 1;
  const begin = (currentPage - 1) * defaultConfig.PAGINATION_ITEM_PER_PAGE;
  const end = begin + defaultConfig.PAGINATION_ITEM_PER_PAGE;
  return data.slice(begin, end);
};

export const paginationHandler = (movieList) => {
  const maxPage = Math.ceil(movieList.length / defaultConfig.PAGINATION_ITEM_PER_PAGE);
  set('maxPage', maxPage);
  return maxPage;
};

export const renderMovieHandler = (Database) => currentData(Database).map((movie) => (
  ` <div class="tooltip">
        <div class="card" id=${movie.id}>
        <a href=${movie.officialSite}><img src=${movie.image.medium} alt="" class="movie-img  "/></a>
        <div class="container">
        <div class="card-header">
            <Label class="movie-name">${movie.name}</Label>
            <span  id=${movie.id} class="material-symbols-outlined">
            favorite 
            </span>
            </div>
        <ul>
            <li class="premiered">${movie.premiered}</li>
            <li class="duration">${movie.averageRuntime} min</li>
            <li id=like_${movie.id} class="likes">${movie.likes ? movie.likes : '0'} Likes</li>
            </ul>
            <button id=comment_${movie.id} class="home-comment-btn">Comment</button>
            <button id=reserve_${movie.id} class="reservation">Reservation</button>
            </div>
    </div>
  <span class="tooltiptext">${JSON.stringify(movie.summary)}</span>
</div>`)).join(' ');

export const renderPaginationHandler = (ListOfmovies) => (`<div class="pagination">
    <a href="#" class="previousPage">&laquo;</a>
    ${new Array(paginationHandler(ListOfmovies)).fill(0).map((page, index) => `<a href="#" class="selector" id=${index + 1}>${index + 1}</a>`).join(' ')}
    <a href="#" class="nextPage">&raquo;</a>
    </div>`);

const setCurrentPage = (currentPage) => set('currentPage', currentPage.toString());

// - TODO: NAVIGATION FOR PAGINATION
export const nextPage = () => setCurrentPage(Math.min(get('currentPage') + 1, get('maxPage')));
export const prevPage = () => setCurrentPage(Math.max(get('currentPage') - 1, 1));
export const jump = (page) => {
  const pageNumber = Math.max(1, page);
  setCurrentPage(Math.min(pageNumber, get('maxPage')));
};
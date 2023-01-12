import DEFAULT from '../../config/default.js';
import commentCounter from './commentCounter.js';

const postUrl = `${DEFAULT.INVOLVEMENT_API_BASEURL}/comments`;

const getUrl = `${DEFAULT.INVOLVEMENT_API_BASEURL}/comments?item_id=`;

const crossBtn = document.querySelector('.comment-cross');
const commentPopup = document.querySelector('.comment-popup');
let commentBtn;
const hidePopup = () => {
  commentPopup.style.display = 'none';
};

crossBtn.addEventListener('click', hidePopup);

const addComment = async (data) => {
  const response = await fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item_id: data.itemId,
      username: data.username,
      comment: data.comment,
    }),
  });
  const commentCall = await response.text();
  return commentCall;
};

const getData = async (id) => {
  const getResponse = await fetch(`${getUrl}${id}`);
  const result = await getResponse.json();
  return result;
};

const display = (comments) => {
  let li = '';
  comments.forEach((commentItem) => {
    li += `
    <li class="comment-detail">
    <span class="date">${commentItem.creation_date}</span>
    <span class="name">${commentItem.username}:</span>
    <span class="commet">${commentItem.comment}</span>
    </li>
    `;
  });
  document.querySelector('.comment-holder').innerHTML = li;
};

const commentCounterUpdate = (indices) => {
  const sum = commentCounter(indices);
  document.querySelector('.comment-heading-container').innerHTML = ` <h3 class="comment-heading">Comments(${sum})</h3> `;
};

const insertComment = async (id) => {
  const insertDom = await getData(id);
  display(insertDom);
  commentCounterUpdate(insertDom);
};
const renderCommentPopup = async (e) => {
  const movieId = parseInt(e.target.id.split('_')[1], 10);
  const movieCard = e.target.parentElement.parentElement;
  const cardImageUrl = movieCard.firstElementChild.firstElementChild.src;
  const releaseDate = movieCard.querySelector('.premiered').innerText;
  const duration = movieCard.querySelector('.duration').innerText;
  const name = movieCard.querySelector('.movie-name').innerText;
  const likes = movieCard.querySelector('.likes').innerText;

  let movieDescription = '';
  movieDescription += `
      <div class="img-container">
      <img src="${cardImageUrl}" alt="${name}">
      <h1 class="movie-title">${name}</h1>
    </div>
    <div class="movie-details">
      <div class="left-detail">
        <div class="starring">Release Date: ${releaseDate}</div>
        <div class="Quality">Quality: HD</div>
      </div>
      <div class="right-detail">
        <div class="Genre">Duration: ${duration}</div>
        <div class="director">👍${likes}</div>
      </div>
    </div>
    <div class="comment-heading-container"></div>
    <ul class="comment-holder">

    </ul>
    <h4 class="add-comment">Add comment</h4>
    <form action="#" id="comment-form">
        <input type="text" placeholder="Name" class="comment-inputs name-input">
        <textarea name="Your insights" id="text-area" cols="30" rows="10" class="comment-inputs comment-text"></textarea>
        <button type="button" id=${movieId} class="comment-btn">Comment</button>
    </form>
  `;
  document.querySelector('.movie-description').innerHTML = movieDescription;
  commentBtn = document.querySelector('.comment-btn');
  commentBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = document.querySelector('.name-input').value.trim();
    const comment = document.querySelector('.comment-text').value.trim();
    const itemId = e.target.id;
    if (username !== '' && comment !== '') {
      await addComment({ itemId, username, comment });
      insertComment(itemId);
    }
    document.getElementById('comment-form').reset();
  });
  insertComment(movieId);
  commentPopup.style.display = 'block';
};

const commentListener = () => {
  const homeCommentBtns = document.querySelectorAll('.home-comment-btn');
  homeCommentBtns.forEach((homeCommentBtn) => {
    homeCommentBtn.addEventListener('click', renderCommentPopup);
  });
};

export {
  addComment,
  getData,
  hidePopup,
  commentListener,
};
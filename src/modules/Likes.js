import DEFAULT from '../../config/default.js';

export const getLike = async () => {
  try {
    const Likes = await fetch(`${DEFAULT.INVOLVEMENT_API_BASEURL}/likes/`);
    const likeData = await Likes.json();
    return likeData;
  } catch (error) {
    throw new Error('unable to get a Data');
  }
};

export const postLike = async (id) => {
  try {
    await fetch(`${DEFAULT.INVOLVEMENT_API_BASEURL}/likes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: Number(id),
      }),
    });
  } catch (error) {
    throw new Error('Can not post Like');
  }
};
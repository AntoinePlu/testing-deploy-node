const axios = require('axios');
const { $ } = require('./bling');

function ajaxHeart(e) {
  e.preventDefault();
  console.log('HEART IT');
  console.log(this);
  axios
    .post(this.action)
    .then(res => {
      //console.log(res.data);
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      // console.log(isHearted); // check if the class is added
      $('.heart-count').textContent = res.data.hearts.length;
      if (isHearted) {
        this.heart.classList.add('heart__button--float'); // add animated when the buttun became hearted
        setTimeout( () => this.heart.classList.remmove('heart__button--float'), 2500 ); // remove the class after 2,5s to avoid having invisible hearts
      }
    })
    .catch(console.error)
};  


export default ajaxHeart;
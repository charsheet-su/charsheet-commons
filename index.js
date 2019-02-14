const revisions = require('./revisions');
const panels = require('./panels');
const comments = require('./comments');
const form = require('./form');
const images = require('./images');

module.exports = {
  revisions,
  panels,
  comments,
  form,
  images,
  onReady: ()=>{
    comments.loadComments();
    form.loadForm();
    images.loadImages();
    revisions.loadRevisions();
  }
};

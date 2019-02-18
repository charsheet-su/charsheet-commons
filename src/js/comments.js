import $ from 'jquery';
import {errorPannel} from './panels';

function loadComments() {

  return $.get('/api/get_comments')
    .then((data) => {
      const t = $('.comments tbody');
      t.empty();// clean
      let i = 1;
      $.each(data, (index, arr) => {
        const r = $('<tr></tr>');
        r.append(`<td>${i}</td><td>${arr.nick}</td><td>${arr.added}</td><td>${arr.text}</td>`);
        t.append(r);
        i++;
      });
    },
    )
    .catch(() => {
      errorPannel.show('Error getting comments');
    });
}
$(document).ready(() => {
  loadComments();
});

function addComment() {

  const comment = $('input[name="comment"]').val();
  if (!comment) {
    errorPannel.show('Please enter comment text');
    return false;
  }
  const data = {comment};
  return $.ajax({
    url: '/api/add_comment',
    data,
    type: 'POST',
  })
    .then((reply) => {
      if (reply.error) {
        errorPannel.show(`Please correct your input:<p>${reply.error}</p>`);
      }
      else {
        loadComments();
      }
    })
    .catch((err) => {
      errorPannel.show(`Error saving sheet, error: ${err}`);
    });
}

export {
  addComment,
  loadComments,
};

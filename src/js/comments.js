import $ from 'jquery';
import {errorPanel} from './panels';
import {isDevel} from './options';

function loadComments() {
  if (isDevel())
  {
    return true;
  }
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
      errorPanel.show('Error getting comments');
    });
}

function addComment() {

  const comment = $('input[name="comment"]').val();
  if (!comment) {
    errorPanel.show('Please enter comment text');
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
        errorPanel.show(`Please correct your input:<p>${reply.error}</p>`);
      }
      else {
        loadComments();
      }
    })
    .catch((err) => {
      errorPanel.show(`Error saving sheet, error: ${err}`);
    });
}

export {
  addComment,
  loadComments,
};

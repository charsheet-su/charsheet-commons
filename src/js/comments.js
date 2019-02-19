import $ from 'jquery';
import * as request from 'axios';
import {errorPanel} from './panels';
import {isDevel} from './options';

async function loadComments() {
  if (isDevel())
  {
    return true;
  }
  try {
    const data = await request('/api/get_comments');
    const t = $('.comments tbody');
    t.empty();// clean
    let i = 1;
    $.each(data, (index, arr) => {
      const r = $('<tr></tr>');
      r.append(`<td>${i}</td><td>${arr.nick}</td><td>${arr.added}</td><td>${arr.text}</td>`);
      t.append(r);
      i++;
    });
    return true;
  }
  catch (err) {
    errorPanel.show(`Error getting comments <p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}

async function addComment() {
  const comment = $('input[name="comment"]').val();
  if (!comment) {
    errorPanel.show('Please enter comment text');
    return false;
  }
  const data = {comment};
  try {
    const reply = await request({
      url: '/api/add_comment',
      data,
      type: 'POST',
    });
    if (reply.error) {
      errorPanel.show(`Please correct your input:<p>${reply.error}</p>`);
      return false;
    }
    return loadComments();
  }
  catch (err) {
    errorPanel.show(`Error saving sheet, error:<p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}

export {
  addComment,
  loadComments,
};

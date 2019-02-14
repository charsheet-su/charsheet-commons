import $ from 'jquery';
import {errorPannel} from './panels';

function loadComments() {

  return $.get("/api/get_comments")
    .then(function (data) {
        var t = $('.comments tbody');
        t.empty();//clean
        var i = 1;
        $.each(data, function (index, arr) {
          var r = $('<tr></tr>');
          r.append('<td>' + i + '</td><td>' + arr.nick + '</td><td>' + arr.added + '</td><td>' + arr.text + '</td>');
          t.append(r);
          i++;
        });
      }
    )
    .catch(function () {
      errorPannel.show('Error getting comments');
    });
}
$(document).ready(function () {
  loadComments();
});

function addComment() {

  var comment = $('input[name="comment"]').val();
  if (!comment) {
    errorPannel.show('Please enter comment text');
    return;
  }
  var data = {comment: comment};
  return $.ajax({
    url: '/api/add_comment',
    data: data,
    type: 'POST'
  })
    .then(function (data) {
      if (data.error) {
        errorPannel.show('Please correct your input:<p>' + data.error + '</p>');
      }
      else {
        loadComments();
      }
    })
    .catch(function (data) {
      errorPannel.show("Error saving sheet, error: " + data + "");
    });
}

module.exports={
  addComment,
  loadComments
};

import $ from 'jquery';
import {errorPannel} from './panels';

function loadRevisions() {
  var jqxhr = $.get("/api/get_revisions")
    .then(function (data) {
        var t = $('.revisions tbody');
        t.empty();//clean
        var i = 1;
        $.each(data, function (index, arr) {
          if (arr.id == undefined)
            arr.id = 0;
          var r = $('<tr></tr>');
          r.append('<td>' + i + '</td><td>' + arr.nick + '</td><td>' + arr.made + '</td><td>' + arr.comment + '</td>');
          r.append('<td><input type="radio" name="compare_from" value="' + arr.id + '"></td><td><input type="radio" name="compare_to" value="' + arr.id + '"></td>');
          r.append('<td><button type="button" class="btn btn-default" data-dismiss="modal" onclick="viewRevision(' + arr.id + ')">View</button></td>');
          if (arr.id != 0)//not current
          {
            r.append('<td><button type="button" class="btn btn-default" data-dismiss="modal" onclick="restoreRevision(' + arr.id + ')">Restore</button></td>');
          }
          else
            r.append('<td></td>');
          t.append(r);
          i++;
        });
      }
    )
    .catch(function () {
      errorPannel.show('Error getting comments');
    })
}

function compareRevisions() {
  var compare_from = "";
  var compare_to = "";
  var selected = $("input[type='radio'][name='compare_from']:checked");
  if (selected.length > 0) {
    compare_from = selected.val();
  }
  else {
    errorPannel.show('Please select a revision to compare from!');
    return;
  }

  selected = $("input[type='radio'][name='compare_to']:checked");
  if (selected.length > 0) {
    compare_to = selected.val();
  }
  else {
    errorPannel.show('Please select a revision to compare to!');
    return;
  }
  //console.log('comparing ' + compare_from + ' to ' + compare_to);

  var data = {compare_from: compare_from, compare_to: compare_to};
  $.ajax({
    url: '/api/compare_revisions',
    data: data,
    type: 'POST'
  })
    .then(function (data) {
      if (data.error) {
        errorPannel.show('Please correct your input:<p>' + data.error + '</p>');
      }
      else {
        $('.compare_revisions').html(data.diff);
      }
    })
    .catch(function (data) {
      errorPannel.show("Error comparing revisions, error:" + " " + data + "");
    });
}

function restoreRevision(revision_id) {
  var data = {revision_id: revision_id};
  $.ajax({
    url: '/api/restore_revision',
    data: data,
    type: 'POST'
  })
    .then(function (data) {
      if (data.error) {
        errorPannel.show('Please correct your input:<p>' + data.error + '</p>');
      }
      else {
        viewRevision(0);
      }
    })
    .catch(function (data) {
      errorPannel.show("Error restoring revision, error:" + " " + data + "");
    });
}


function viewRevision(id) {
  var pathname = window.location.pathname;
  var path = pathname.split('/');
  if (id == 0) {
    window.location.replace('/' + path[1] + '/' + path[2] + '/' + path[3] + '/');
    return;
  }
  var revision = '/' + path[1] + '/' + path[2] + '/' + path[3] + '/' + id + '/';
  window.location.replace(revision);
}

function ifRevision() {
  var pathname = window.location.pathname;
  var path = pathname.split('/');
  //alert(path.length);
  if (path.length === 6)
    return true;
  return false;

}

function save_revision() {
  var comment = $('input[name="revision_comment"]').val();
  if (!comment) {
    errorPannel.show('Please enter comment text');
    return;
  }
  var data = {comment: comment};
  $.ajax({
    url: '/api/add_revision',
    data: data,
    type: 'POST'
  })
    .then(function (data) {
      if (data.error) {
        errorPannel.show('Please correct your input:<p>' + data.error + '</p>');
      }
      else {
        loadRevisions();
      }
    })
    .catch(function (data) {
      errorPannel.show("Error saving revision, error:" + " " + data + "");
    })
}

module.exports = {
  loadRevisions,
  compareRevisions,
  viewRevision,
  ifRevision,
  restoreRevision,
};

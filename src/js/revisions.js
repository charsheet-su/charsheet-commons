import $ from 'jquery';
import {errorPannel} from './panels';

async function loadRevisions() {
  return $.get('/api/get_revisions')
    .then((data) => {
      const t = $('.revisions tbody');
      t.empty();// clean
      let i = 1;
      $.each(data, (index, arr) => {
        if (!arr.id) { arr.id = 0; }
        const r = $('<tr></tr>');
        r.append(`<td>${i}</td><td>${arr.nick}</td><td>${arr.made}</td><td>${arr.comment}</td>`);
        r.append(`<td><input type="radio" name="compare_from" value="${arr.id}"></td>
<td><input type="radio" name="compare_to" value="${arr.id}"></td>`);
        r.append(`<td><button type="button" class="btn btn-default" data-dismiss="modal"
 onclick="viewRevision(${arr.id})">View</button></td>`);
        if (arr.id !== 0)// not current
        {
          r.append(`<td><button type="button" class="btn btn-default"
 data-dismiss="modal" onclick="restoreRevision(${arr.id})">Restore</button></td>`);
        }
        else r.append('<td></td>');
        t.append(r);
        i++;
      });
    },
    )
    .catch(() => {
      errorPannel.show('Error getting comments');
    });
}

async function compareRevisions() {
  let compareFrom = '';
  let compareTo = '';
  let selected = $("input[type='radio'][name='compare_from']:checked");
  if (selected.length > 0) {
    compareFrom = selected.val();
  }
  else {
    errorPannel.show('Please select a revision to compare from!');
    return false;
  }

  selected = $("input[type='radio'][name='compare_to']:checked");
  if (selected.length > 0) {
    compareTo = selected.val();
  }
  else {
    errorPannel.show('Please select a revision to compare to!');
    return false;
  }
  // console.log('comparing ' + compare_from + ' to ' + compare_to);

  const data = {compare_from: compareFrom, compare_to: compareTo};
  return $.ajax({
    url: '/api/compare_revisions',
    data,
    type: 'POST',
  })
    .then((reply) => {
      if (reply.error) {
        errorPannel.show(`Please correct your input:<p>${reply.error}</p>`);
      }
      else {
        $('.compare_revisions').html(reply.diff);
      }
    })
    .catch((err) => {
      errorPannel.show(`Error comparing revisions, error: ${err}`);
    });
}

function viewRevision(id) {
  const {pathname} = window.location;
  const path = pathname.split('/');
  if (parseInt(id, 10) === 0) {
    window.location.replace(`/${path[1]}/${path[2]}/${path[3]}/`);
    return;
  }
  const revision = `/${path[1]}/${path[2]}/${path[3]}/${id}/`;
  window.location.replace(revision);
}

async function restoreRevision(revisionId) {
  const data = {revision_id: revisionId};
  return $.ajax({
    url: '/api/restore_revision',
    data,
    type: 'POST',
  })
    .then((reply) => {
      if (reply.error) {
        errorPannel.show(`Please correct your input:<p>${reply.error}</p>`);
      }
      else {
        viewRevision(0);
      }
    })
    .catch((err) => {
      errorPannel.show(`Error restoring revision, error: ${err}`);
    });
}


function saveRevision() {
  const comment = $('input[name="revision_comment"]').val();
  if (!comment) {
    errorPannel.show('Please enter comment text');
    return false;
  }
  const data = {comment};
  return $.ajax({
    url: '/api/add_revision',
    data,
    type: 'POST',
  })
    .then((reply) => {
      if (reply.error) {
        errorPannel.show(`Please correct your input:<p>${reply.error}</p>`);
        return false;
      }

      return loadRevisions();

    })
    .catch((err) => {
      errorPannel.show(`Error saving revision, error: ${err}`);
    });
}

export {
  loadRevisions,
  compareRevisions,
  viewRevision,
  restoreRevision,
  saveRevision,
};

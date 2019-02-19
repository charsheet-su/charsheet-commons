import $ from 'jquery';
import {errorPanel} from './panels';
import {isDevel} from './options';

async function compareRevisions() {
  let compareFrom = '';
  let compareTo = '';
  let selected = $("input[type='radio'][name='compare_from']:checked");
  if (selected.length > 0) {
    compareFrom = selected.val();
  }
  else {
    errorPanel.show('Please select a revision to compare from!');
    return false;
  }

  selected = $("input[type='radio'][name='compare_to']:checked");
  if (selected.length > 0) {
    compareTo = selected.val();
  }
  else {
    errorPanel.show('Please select a revision to compare to!');
    return false;
  }
  // console.log('comparing ' + compare_from + ' to ' + compare_to);

  const data = {compare_from: compareFrom, compare_to: compareTo};
  try {
    const reply = await $.ajax({
      url: '/api/compare_revisions',
      data,
      type: 'POST',
    });
    if (reply.error) {
      errorPanel.show(`Please correct your input:<p>${reply.error}</p>`);
      return false;
    }
    $('.compare_revisions').html(reply.diff);
    return true;
  }
  catch (err) {
    errorPanel.show(`Error comparing revisions, error: <p>${err.message}</p>`);
    console.log(err);
    return false;
  }
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
  try {
    const reply = await $.ajax({
      url: '/api/restore_revision',
      data,
      type: 'POST',
    });
    if (reply.error) {
      errorPanel.show(`Please correct your input:<p>${reply.error}</p>`);
      return false;
    }
    viewRevision(0);
    return true;
  }
  catch (err) {
    errorPanel.show(`Error restoring revision, error: <p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}

async function loadRevisions() {
  if (isDevel())
  {
    return true;
  }
  try {
    const data = await $.get('/api/get_revisions');
    const table = $('.revisions tbody');
    table.empty();// clean
    let i = 1;
    data.forEach((arr)=>{
      if (!arr.id) { arr.id = 0; }
      const row = $('<tr></tr>');
      row.append(`<td>${i}</td><td>${arr.nick}</td><td>${arr.made}</td><td>${arr.comment}</td>`);
      row.append(`<td><input type="radio" name="compare_from" value="${arr.id}"></td>
<td><input type="radio" name="compare_to" value="${arr.id}"></td>`);
      const viewRevisionBtn = $('<button type="button" class="btn btn-default" data-dismiss="modal">View</button>');
      viewRevisionBtn.click(()=>viewRevision(arr.id));
      row.append($('<td></td>').append(viewRevisionBtn));
      if (arr.id !== 0)// not current
      {
        const restoreRevisionButton = $('<button type="button" class="btn btn-default" data-dismiss="modal" >Restore</button>');
        restoreRevisionButton.click(()=>restoreRevision(arr.id));
        row.append($('<td></td>').append(restoreRevisionButton));
      }
      else row.append('<td></td>');
      table.append(row);
      i++;
    });
    return true;
  }
  catch (err)
  {
    errorPanel.show(`Error getting comments <p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}


async function saveRevision() {
  const comment = $('input[name="revision_comment"]').val();
  if (!comment) {
    errorPanel.show('Please enter comment text');
    return false;
  }
  const data = {comment};
  try {
    const reply = $.ajax({
      url: '/api/add_revision',
      data,
      type: 'POST',
    });
    if (reply.error) {
      errorPanel.show(`Please correct your input:<p>${reply.error}</p>`);
      return false;
    }

    return loadRevisions();
  }
  catch (err) {
    errorPanel.show(`Error saving revision, error: <p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}

export {
  loadRevisions,
  compareRevisions,
  viewRevision,
  restoreRevision,
  saveRevision,
};

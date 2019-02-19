import $ from 'jquery';
import {compareRevisions, saveRevision} from './revisions';
import {addComment} from './comments';

const header = `<h1>Useful things</h1>

<a class="btn btn-default" href="/my">Get back to your charsheets</a>
<h2>Change viewing mode</h2>

<p>Print mode removes empty elements (as "none", or empty dots) and temporary values
 which you can change during session - such as willpower, health, exp, etc.</p>

<p>Everything after "useful things" won\`t be printed anyway.</p>

<button class="btn btn-default" type="button" onclick="window.changeMode(1)">Print mode</button>
<button class="btn btn-default" type="button" onclick="window.changeMode(0)">Edit mode</button>`;

const revisions = `
<h2>Revisions</h2>

<p>It\`a really cool staff. You can save named versions of your character sheets and compare them. Especially useful for shared editing.</p>
You can save current version as revision - just type some comment to remember, why you did it.<div class="input-group">
  <input class="form-control" type="text" placeholder="Enter some comment" name="revision_comment">
  <span class="input-group-btn">
  <button class="btn btn-success" type="button" id="saveRevision">Save</button>
  </span>
  </div>

  <table class="table table-striped revisions">
  <thead>
  <tr>
  <th>#</th>
  <th>Author</th>
  <th>Date</th>
  <th>Comment</th>
  <th>Compare this</th>
<th>Compare with</th>
<th>View</th>
<th>Restore</th>
</tr>
</thead>
<tbody>
</tbody>
</table>
<div align="right">
  <button type="button" class="btn btn-default" data-dismiss="modal" id="compareRevisions">Compare</button>
  </div>
  <div class="compare_revisions"></div>`;

const comments = `<h2>Comments</h2>

  <p>If you want to discuss your character sheet with your master or your friends, you can easily do it here!</p>

<div class="input-group">
  <input class="form-control" type="text" placeholder="Enter some comment" name="comment">
  <span class="input-group-btn">
  <button class="btn btn-success" type="button" id="addComment">Add comment</button>
</span>
</div>

<table class="table table-striped comments">
  <thead>
  <tr>
  <th>#</th>
  <th>Author</th>
  <th>Date</th>
  <th>Comment</th>
  </tr>
  </thead>
  <tbody>
  </tbody>
  </table>`;

function loadForm()
{
  const usefulThings = $('.useful_things');
  usefulThings.append(header);
  usefulThings.append(revisions);
  usefulThings.append(comments);
  $('#saveRevision').click(()=>saveRevision());
  $('#compareRevisions').click(()=>compareRevisions());
  $('#addComment').click(()=>addComment());
}

// eslint-disable-next-line import/prefer-default-export
export {loadForm};

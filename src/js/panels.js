import $ from 'jquery';

/**
 * just a little something to show while loading
 * @type {{show, hide}}
 */
class LoadingPanel
{
  constructor()
  {
    this.lpDialog = $(`
    <div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>
    <div class='modal-dialog' >
    <div class='modal-content'>
    <div class='modal-header'><b>Loading...</b></div>
    <div class='modal-body'>
    <div class='progress'>
    <div class='progress-bar progress-bar-striped active' role='progressbar'
     aria-valuenow='100' aria-valuemin='100' aria-valuemax='100' style='width:100%'>
    Please Wait...
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>`);
  }

  show() {
    this.lpDialog.modal('show');
  }

  hide() {
    this.lpDialog.modal('hide');
  }
}

/**
 * we use it to show errors
 * @type {{show, hide}}
 */
class ErrorPanel
{
  constructor() {
    this.lpDialog = $(`<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>
    <div class='modal-dialog' >
    <div class='modal-content'>
    <div class='modal-header'><b>Error!</b></div>
    <div class='modal-body'>
    <div class='alert alert-danger' role='alert'>
    Some error text
    </div>
    <div class='modal-footer'>
    <button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>
    </div>
    </div>
    </div>
    </div>
    </div>`);
  }

  show(error) {
    this.lpDialog.find('.alert').html(error);
    this.lpDialog.modal('show');
  }

  hide() {
    this.lpDialog.modal('hide');
  }
}

const errorPanel = new ErrorPanel();
const loadingPanel = new LoadingPanel();

export {
  errorPanel,
  loadingPanel,
};

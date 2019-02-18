import $ from 'jquery';

/**
 * just a little something to show while loading
 * @type {{show, hide}}
 */
function LoadingPannel() {
  const lpDialog = $(`
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
  return {
    show() {
      lpDialog.modal('show');
    },
    hide() {
      lpDialog.modal('hide');
    },
  };
}

/**
 * we use it to show errors
 * @type {{show, hide}}
 */
function ErrorPannel() {
  const lpDialog = $(`<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>
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
  return {
    show(error) {

      lpDialog.find('.alert').html(error);
      lpDialog.modal('show');
    },
    hide() {
      lpDialog.modal('hide');
    },
  };
}

const errorPannel = ErrorPannel();
const loadingPannel = LoadingPannel();

export {
  errorPannel,
  loadingPannel,
};

import $ from 'jquery';
import {errorPanel} from './panels';

async function readURL(input, to) {

  if (!(input.files || !input.files[0])) {
    errorPanel.show('No image to add!');
    return false;
  }
  const reader = new FileReader();
  const formdata = new FormData();

  /* reader.onload = function (e) {
   $('.' + to).attr('src', e.target.result);
   } */

  reader.readAsDataURL(input.files[0]);
  formdata.append('images', input.files[0]);
  formdata.append('image_type', to);

  try {
    const res = await $.ajax({
      url: '/api/upload_image',
      type: 'POST',
      data: formdata,
      processData: false,
      contentType: false,
    });

    if (res.error) {
      errorPanel.show(`Error uploading image!<p>${res.error}</p>`);
      return false;
    }
    if (!res.uri) {
      errorPanel.show(`No uri in result!<p>${JSON.stringify(res)}</p>`);
      return false;
    }
    $(`img[class="${to}"]`).attr('src', res.uri).css('display', 'block');
    return true;
  }
  catch (err) {
    errorPanel.show(`Error uploading image!<p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}

async function removeImage(type) {
  const data = new FormData();
  data.append('image_type', type);
  try {
    const res = await $.ajax({
      url: '/api/removeImage',
      type: 'POST',
      data,
      processData: false,
      contentType: false});
    if (res.error) {
      errorPanel.show(`Error removing image!<p>${res.error}</p>`);
      return false;
    }
    $(`img[class="${type}"]`).css('display', 'none');// default image
    return true;
  }
  catch (err) {
    errorPanel.show(`Error uploading image!<p>${err.message}</p>`);
    console.log(err);
    return false;
  }
}

function loadImages()
{
  // non arrow funcs used to have context
  $('#group_chart').change(function () { readURL(this, 'group_chart'); });
  $('#character_sketch').change(function () { readURL(this, 'character_sketch'); });

  $('#remove_img_group').click(()=>removeImage('group_chart'));
  $('#remove_img_char').click(()=>removeImage('character_sketch'));
}

// eslint-disable-next-line import/prefer-default-export
export {loadImages};

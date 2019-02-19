import $ from 'jquery';
import {errorPanel} from './panels';

async function readURL(input, to) {

  if (!(input.files && input.files[0])) {
    return;
  }
  const reader = new FileReader();
  const formdata = new FormData();

  /* reader.onload = function (e) {
   $('.' + to).attr('src', e.target.result);
   } */

  reader.readAsDataURL(input.files[0]);
  formdata.append('images', input.files[0]);
  formdata.append('image_type', to);

  if (!formdata) {
    return;
  }
  $.ajax({
    url: '/api/upload_image',
    type: 'POST',
    data: formdata,
    processData: false,
    contentType: false,
    success(res) {
      if (res.error) {
        errorPanel.show(`Error uploading image!${res.error}`);

      } else if (res.uri) {
        $(`img[class="${to}"]`).attr('src', res.uri).css('display', 'block');
      }
    },
    error(res) {
      errorPanel.show(`Error uploading image!${res}`);
    },
  });


}

async function removeImage(type) {
  const data = new FormData();
  data.append('image_type', type);
  $.ajax({
    url: '/api/removeImage',
    type: 'POST',
    data,
    processData: false,
    contentType: false,
    success(res) {
      if (res.error) {
        errorPanel.show(`Error removing image!${res.error}`);

      } else {
        $(`img[class="${type}"]`).css('display', 'none');// default image
      }
    },
    error(res) {
      errorPanel.show(`Error uploading image!${res}`);
    },
  });
}

function loadImages()
{
  $('#group_chart').change(()=>readURL(this, 'group_chart'));
  $('#character_sketch').change(()=>readURL(this, 'character_sketch'));

  $('#remove_img_group').click(()=>removeImage('group_chart'));
  $('#remove_img_char').click(()=>removeImage('character_sketch'));
}

// eslint-disable-next-line import/prefer-default-export
export {loadImages};

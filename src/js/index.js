import * as revisions from './revisions';
import * as panels from './panels';
import * as comments from './comments';
import * as form from './form';
import * as images from './images';
import * as options from './options';

const onReady = ()=>{
  return Promise.all([comments.loadComments(), form.loadForm(), images.loadImages(), revisions.loadRevisions()]);
};

export {
  revisions,
  panels,
  comments,
  form,
  images,
  onReady,
  options,
};

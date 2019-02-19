import requestPromise from 'request-promise';
import {errorPanel} from './panels';
import {isRevision, isDevel} from './options';

async function load(mockData) {

  if (isDevel()) {
    // do not load for development environment
    console.log('dev mode, returning mock data');
    return mockData;
  }
  const options = {
    uri: `${window.location.protocol}//${window.location.hostname}/api/load`,
    json: true, // Automatically parses the JSON string in the response
  };

  return requestPromise(options);
}

// here we send dot values to server with ajax
async function sendDot(attr, value) {
  // var data = {};
  // attr=attr.replace('[','%5B').replace(']','%5D');
  // data[attr] = value;
  if (isDevel()) {
    console.log(`dev mode, saving ${attr} = ${value}`);
    return true;
  }
  if (isRevision()) {
    errorPanel.show('You can not edit revision data! If you want it - restore revision and edit it.');
    return false;
  }
  const options = {
    method: 'POST',
    uri: `${window.location.protocol}//${window.location.hostname}/api/save/`,
    form: {
      name: attr, value,
    },
    json: true,
    headers: {},
  };

  try {
    const data = await requestPromise(options);
    if (data.error !== undefined) {
      errorPanel.show(`Error sending dots:<p>${data.error}</p>`);
      return false;
    }
    return true;
  }
  catch (err) {
    errorPanel.show(`Error sending dots: <p>${err.message}</p>`);
    return false;
    // POST failed...
  }
}

export {
  load, sendDot,
};

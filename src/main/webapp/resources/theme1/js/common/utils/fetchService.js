import "cross-fetch";

function checkResponseStatus(response) {
  if (response.status != 200) {
    throw new Error("Bad Response from Server");
  }
}

function doFetch(path, options, fullUrl) {
  //Assign some defaults for fetch
  return fetch(
    fullUrl ? fullUrl : "https://" + window.location.host + path,
    options
  );
}

export default {
  checkResponseStatus,
  doFetch
};

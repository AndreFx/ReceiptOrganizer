import "cross-fetch";

function checkResponseStatus(response) {
  if (response.status != 200) {
    throw new Error("Bad Response from Server");
  }
}

function encodeURLParams(url, params) {
  Object.keys(params).forEach(function(key) {
    if (
      (params[key] && !Array.isArray(params[key])) ||
      (params[key] && Array.isArray(params[key]) && params[key].length != 0)
    ) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url;
}

function doFetch(url, options) {
  if (options) {
    return fetch(url, options);
  } else {
    return fetch(url);
  }
}

export default {
  checkResponseStatus,
  encodeURLParams,
  doFetch
};

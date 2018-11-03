import fetch from "cross-fetch";

export function checkResponseStatus(response) {
  if (response.status != 200) {
    throw new Error("Bad Response from Server");
  }
}

export default function doFetch(path, options, fullUrl) {
  //Assign some defaults for fetch
  return fetch(
    fullUrl ? fullUrl : "https://" + window.location.host + path,
    options
  );
}

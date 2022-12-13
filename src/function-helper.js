export function urlEncoded(obj) {
  var str = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(
        encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
      )
    }
  }
  return str.join("&");
}

export function capitalizeLetter(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


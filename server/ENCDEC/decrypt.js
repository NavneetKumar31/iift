var CryptoJS = require("crypto-js");
var myPassword = "myPassword";

module.exports = function (myEncryptString) {
  var decrypted = CryptoJS.AES.decrypt(myEncryptString, myPassword);
  return decrypted.toString(CryptoJS.enc.Utf8);
}

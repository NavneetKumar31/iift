var CryptoJS = require("crypto-js");
var myPassword = "myPassword";

module.exports = function (myString) {
    var encrypted = CryptoJS.AES.encrypt(myString, myPassword);
    return encrypted.toString();
}

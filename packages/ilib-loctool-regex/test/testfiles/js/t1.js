var fs = require("foobar");

var t1 = function() {
    console.log("If you find this, you found the wrong string!");
}

t1.prototype.tester = function() {
    $t("This is a test");

    $t("This is a test with a unique id");
};

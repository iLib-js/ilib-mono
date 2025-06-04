import ResBundle from 'ilib-resbundle';

const rb = new ResBundle({
    name: "strings",
    basePath: "resources",
    locale: "de-DE"
});

function t1() {
    console.log("If you find this, you found the wrong string!");
}

function tester() {
    let returnValue = rb.getStringJS("Hello") + "\n";
    returnValue += rb.getString("This is a string that has no translation yet") + "\n";
    returnValue += rb.getString("This is a test with a unique id", "id1") + "\n";
    // see if the loctool can extract a call that spans multiple lines
    returnValue += rb.
        getString(
            "Thank you"
        ) + "\n";

    return returnValue;
};

console.log(tester());

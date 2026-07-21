msg1.reason = $L('Hello');
msg2.reason = $L('Hello World');

function tester() {
    return rb.getString("Thank you") + "\n";
};

console.log(tester());

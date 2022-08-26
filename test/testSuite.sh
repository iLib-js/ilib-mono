VERSION=$(node -v | sed 's/v//' | sed 's/\..*//')
if [ $VERSION -lt 12 ]
then
    # testing under commonjs by transpiling with babel first
    echo node test/testSuite.cjs
    node test/testSuite.cjs
else
    # testing native ESM modules
    echo node test/testSuite.js
    node test/testSuite.js
fi

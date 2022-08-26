VERSION=$(node -v | sed 's/v//' | sed 's/\..*//')
if [ $VERSION -lt 12 ]
then
    echo node test/testSuite.cjs
    node test/testSuite.cjs
else
    echo node test/testSuite.js
    node test/testSuite.js
fi

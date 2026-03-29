export default function getLocaleData() {
    return     {
        "root": {
            "file1": {
                "content": "file1"
            },
            "file2": {
                "content": "file2"
            },
            "merge2": {
                "a": "a from files2",
                "b": "b from files",
                "c": "c from files2",
                "d": "d from files2"
            },
            "merge3": {
                "a": "a from files",
                "b": "b from files"
            },
            "test": {
                "test": "data",
                "value": 42
            },
            "tester": {
                "a": "b",
                "c": "d",
                "x": {
                    "m": "n",
                    "o": "p"
                }
            }
        }
    };
};
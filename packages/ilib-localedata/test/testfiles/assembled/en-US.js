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
        },
        "en": {
            "merge": {
                "a": "a from files2 en",
                "b": "b from files en",
                "c": "c from files en",
                "d": "d from files2 en",
                "e": "e from files2 en"
            },
            "tester": {
                "a": "b en from files2",
                "x": {
                    "o": "p en from files2"
                }
            }
        },
        "en-US": {
            "merge": {
                "a": "a from files2 en-US",
                "b": "b from files en-US",
                "d": "d from files2 en-US"
            },
            "tester": {
                "c": "d en-US",
                "x": {
                    "o": "p en from files2 en-US"
                },
                "a": "b en from files2 en-US"
            }
        }
    };
};
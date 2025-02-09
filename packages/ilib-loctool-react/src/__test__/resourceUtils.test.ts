import {extract, mapToResources} from "../resourceUtils";

describe("extract util function", () => {
    it("extracts strings from FormattedMessage component (JSX)", async () => {
        const result = await extract(require.resolve("./test-files/TestComponent2.jsx"));

        expect(result).toEqual({
            "FYMx4Q": {
                "defaultMessage": "JSX with props interpolation {name}",
                "description": "Interpolated name prop"
            },
            "SVWoKJ": {
                "defaultMessage": "JSX Control Panel",
                "description": "A sample message for JSX file"
            }
        });

    });

    it("extracts strings from FormattedMessage component (TSX)", async () => {
        const result = await extract(require.resolve("./test-files/TestComponent1.tsx"));

        expect(result).toEqual({
            "fnw3vP": {
                "defaultMessage": "TSX Message 007",
                "description": "A sample message for TSX file"
            }
        });
    });

    it("extracts strings from a intl.formatMessage() function call (JS)", async () => {
        const result = await extract(require.resolve("./test-files/test2.js"));

        expect(result).toEqual({
            "app.greeting": {
                "defaultMessage": "Hello, {name}!",
                "description": "Greeting to welcome the user to the app"
            }
        });
    });

    it("extracts strings from a intl.formatMessage() function call (TS)", async () => {
        const result = await extract(require.resolve("./test-files/test1.ts"));

        expect(result).toEqual({
            "app.bye": {
                "defaultMessage": "Bye, {name}!",
                "description": "Bye bye to the user of the app"
            }
        });
    });
});

describe("mapToResources util function", () => {
    it("maps messages to ResourceString objects", () => {
        const messages = {
            "FYMx4Q": {
                "defaultMessage": "JSX with props interpolation {name}",
                "description": "Interpolated name prop"
            },
            "app.bye": {
                "defaultMessage": "Bye, {name}!",
                "description": "Bye bye to the user of the app"
            },
        };
        const options = {
            sourceLocale: "en-US",
            projectId: "project1",
        };
        const createResource = jest.fn();

        const resources = mapToResources({
            messages,
            options,
            createResource,
        });

        expect(resources).toHaveLength(2);
        expect(createResource).toHaveBeenCalledTimes(2);
        expect(createResource).toHaveBeenNthCalledWith(1, {
            resType: "string",
            key: "FYMx4Q",
            source: "JSX with props interpolation {name}",
            comment: "Interpolated name prop",
            sourceLocale: "en-US",
            project: "project1",
        });
        expect(createResource).toHaveBeenNthCalledWith(2, {
            resType: "string",
            key: "app.bye",
            source: "Bye, {name}!",
            comment: "Bye bye to the user of the app",
            sourceLocale: "en-US",
            project: "project1",
        });
    });
});

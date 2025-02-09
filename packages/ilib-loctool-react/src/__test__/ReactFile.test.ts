import {ReactFileType} from "../ReactFileType";
import {API, Project} from "loctool";

describe("ReactFileType", () => {
    it("returns a list of handled extensions", () => {
        const reactFileType = createReactFileType();

        expect(reactFileType.getExtensions()).toEqual([".js", ".jsx", ".ts", ".tsx"]);
    });

    test("returns associated data type", () => {
        const reactFileType = createReactFileType();

        expect(reactFileType.getDataType()).toBe("x-react");
    });

    it.each([".js", ".jsx", ".ts", ".tsx"])("handles %s files", (extension) => {
        const reactFileType = createReactFileType();

        expect(reactFileType.handles(`file.${extension}`)).toBe(true);
    });

    it.each([".html", ".scss"])("does not handle unsupported file extensions, e.g. %s", (extension) => {
        const reactFileType = createReactFileType();

        expect(reactFileType.handles(`file.${extension}`)).toBe(false);
    });

});

function createReactFileType() {
    const project = {
        getSourceLocale: jest.fn().mockReturnValue("en-US"),
        getRoot: jest.fn().mockReturnValue("/root"),
    } as unknown as Project;

    const api = {
        newTranslationSet: () => {
        },
    } as unknown as API;

    return new ReactFileType(project, api);
}

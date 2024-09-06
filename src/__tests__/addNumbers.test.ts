import addNumbers from "../addNumbers";

describe("addNumbers", () => {
    // unnecessary async to test linting
    it("should add two numbers", async () => {
        expect(addNumbers(1, 2)).toBe(3);
    });
});

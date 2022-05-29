import { ValidateUserName } from "../src";

test("validator must respect alpha only domain names", () => {
    expect(ValidateUserName("TESTING")).toBe(true)
});


test("validator must reject domain names with special characters", () => {
    expect(ValidateUserName("TESTING-1234")).toBe(false)
});


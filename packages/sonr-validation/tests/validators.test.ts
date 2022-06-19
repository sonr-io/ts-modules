import { ValidateDisplayName, ValidateUserName } from "../src";

test("User name validator must respect alpha only domain names", () => {
    expect(ValidateUserName("TESTING")).toBe(true)
});


test("User name validator must reject domain names with special characters", () => {
    expect(ValidateUserName("TESTING-1234")).toBeInstanceOf(Error);
});

test("Display Name validator should accept names with `.`", () => {
    expect(ValidateDisplayName("alice.snr")).toBe(true)
});

test("Display Name validator should accept names with `.` and are atleast 3 characters", () => {
    expect(ValidateDisplayName("bob.snr")).toBe(true)
});

test("Display Name validator should reject names less than 3 characters", () => {
    expect(ValidateDisplayName("bo.snr")).toBeInstanceOf(Error);
});

test("Display name should reject without `.snr`", () => {
    expect(ValidateDisplayName("bob")).toBeInstanceOf(Error);
});

test("Display name should reject with speical characters", () => {
    expect(ValidateDisplayName("bob-1234$%^.snr")).toBeInstanceOf(Error);
});

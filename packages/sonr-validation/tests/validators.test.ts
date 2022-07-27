import { 
    HasAtLeastOneLowercaseCharacter,
    HasAtLeastOneNumber,
    HasAtLeastOneSpecialCharacter,
    HasAtLeastOneUppercaseCharacter,
    HasNoSpecialCharacter,
    IsRequired, 
    NoSpaces, 
    ValidateDisplayName, 
    ValidateUserName 
} from "../src";

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

test("Should return a Error if field is required and empty", () => {
    expect(IsRequired("")).toBeInstanceOf(Error);
});

test("Should return true if field is required and not empty", () => {
    expect(IsRequired("bob")).toBe(true);
});

test("Should return a Error if field has no special character", () => {
    expect(HasAtLeastOneSpecialCharacter("bob")).toBeInstanceOf(Error);
});

test("Should return true if field has on or more special characters", () => {
    expect(HasAtLeastOneSpecialCharacter("bob@bob")).toBe(true)
    expect(HasAtLeastOneSpecialCharacter("#bob@bob#")).toBe(true)
});

test("Should return a Error if field has special characters", () => {
    expect(HasNoSpecialCharacter("bob@bob")).toBeInstanceOf(Error);
});

test("Should return true if field has no special characters", () => {
    expect(HasNoSpecialCharacter("bob")).toBe(true);
});

test("Should return a Error if field has no uppercase characters", () => {
    expect(HasAtLeastOneUppercaseCharacter("bob")).toBeInstanceOf(Error);
});

test("Should return true if field has at least on uppercase character", () => {
    expect(HasAtLeastOneUppercaseCharacter("Bob")).toBe(true);
    expect(HasAtLeastOneUppercaseCharacter("BoB")).toBe(true);
    expect(HasAtLeastOneUppercaseCharacter("BOB")).toBe(true);
});

test("Should return a Error if field has no lowercase characters", () => {
    expect(HasAtLeastOneLowercaseCharacter("BOB")).toBeInstanceOf(Error);
});

test("Should return true if field has at least on lowercase character", () => {
    expect(HasAtLeastOneLowercaseCharacter("BoB")).toBe(true);
    expect(HasAtLeastOneLowercaseCharacter("bOB")).toBe(true);
    expect(HasAtLeastOneLowercaseCharacter("bob")).toBe(true);
});

test("Should return a Error if field has no numeric characters", () => {
    expect(HasAtLeastOneNumber("bob")).toBeInstanceOf(Error);
});

test("Should return true if field has at least one numeric character", () => {
    expect(HasAtLeastOneNumber("BOB-number-1")).toBe(true);
    expect(HasAtLeastOneNumber("BoBx2")).toBe(true);
});


test("Should return a Error if field has at least one space", () => {
    expect(NoSpaces("b ob")).toBeInstanceOf(Error);
    expect(NoSpaces(" bob")).toBeInstanceOf(Error);
    expect(NoSpaces(" bob ")).toBeInstanceOf(Error);
});


test("Should return true if field has no space", () => {
    expect(NoSpaces("bob")).toBe(true);
});
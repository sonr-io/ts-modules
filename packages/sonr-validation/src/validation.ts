import { ErrorInvalidLength, ErrorMissingPostfix, ErrorSpecialCharacters } from "./Errors";
import { ErrorHasAtLeastOneLowercaseCharacter } from "./Errors/HasAtLeastOneLowercaseCharacter";
import { ErrorHasAtLeastOneNumber } from "./Errors/HasAtLeastOneNumber";
import { ErrorHasAtLeastOneUppercaseCharacter } from "./Errors/HasAtLeastOneUppercaseCharacter";
import { ErrorHasNoSpecialCharacters } from "./Errors/HasNoSpecialCharacters";
import { ErrorHasSpecialCharacter } from "./Errors/HasSpecialCharacter";
import { ErrorIsRequired } from "./Errors/IsRequired";
import { ErrorNoSpaces } from "./Errors/noSpaces";

export function ValidateUserName(username: string): Error | true{
    if (username == "" || username.length < 3) 
        return new ErrorInvalidLength(3);

    const processed: string = username.toLowerCase().replace(/\s/g, '');
    const matches: RegExpMatchArray = processed.match('^[a-zA-Z0-9]+$');
    return matches?.index === 0 ? true : new ErrorSpecialCharacters();
}

export function ValidateDisplayName(displayname: string): Error | true {;
    const splitSnrName: string[] =  displayname.toLowerCase().split('.');
    if (splitSnrName.length != 2) { return new ErrorMissingPostfix(); };
    const name: string = splitSnrName && splitSnrName.length > 1 ? splitSnrName[0] : "";
    return ValidateUserName(name);
}

export function IsRequired(value: string): Error | true {
    if(!value) return new ErrorIsRequired()
    return true
}

export function HasAtLeastOneSpecialCharacter (str: string): Error | true  {
    if(!/[~!@#$%^&*_\-+=\\`|\\(){}[\]:;"'<>,.?/]/.test(str)) return new ErrorHasSpecialCharacter()
    return true
}

export function HasNoSpecialCharacter(str: string): Error | true  {
    if(/[~!@#$%^&*_\-+=\\`|\\(){}[\]:;"'<>,.?/]/.test(str)) return new ErrorHasNoSpecialCharacters()
    return true
}

export function HasAtLeastOneUppercaseCharacter (str: string): Error | true  {
    if(!/[A-Z]+/.test(str)) return new ErrorHasAtLeastOneUppercaseCharacter()
    return true
}

export function HasAtLeastOneLowercaseCharacter (str: string): Error | true  {
    if(!/[a-z]+/.test(str)) return new ErrorHasAtLeastOneLowercaseCharacter()
    return true
}

export function HasAtLeastOneNumber (str: string): Error | true  {
    if(!/\d+/.test(str)) return new ErrorHasAtLeastOneNumber()
    return true
}

export function NoSpaces (value: string): Error | true  {
    if(!/^\S*$/.test(value)) return new ErrorNoSpaces()
    return true
}
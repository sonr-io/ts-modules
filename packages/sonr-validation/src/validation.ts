import { ErrorInvalidLength, ErrorMissingPostfix, ErrorSpecialCharacters } from "./Errors";

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
export function ValidateUserName(username: string): boolean{
    const processed: string = username.toLowerCase().replace(/\s/g, '');
    const matches: RegExpMatchArray = processed.match('[a-zA-Z0-9]+$');
    return matches.index === 0;
}

export function ValidateDisplayName(displayname: string): boolean {
    if (displayname.indexOf(".") < 0) { return false; }
    if (displayname.split(".").length > 2) {return false }
    const name: string =  displayname.toLowerCase().split('.')[0];
    return ValidateUserName(name)
}

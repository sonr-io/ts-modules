export function ValidateUserName(username: string): boolean {
    if (username == "" || username.length < 3) return false;

    const processed: string = username.toLowerCase().replace(/\s/g, '');
    const matches: RegExpMatchArray = processed.match('^[a-zA-Z0-9]+$');
    return matches?.index === 0;
}

export function ValidateDisplayName(displayname: string): boolean {
    if (displayname.indexOf(".") < 0) { return false; };
    if (displayname.split(".").length > 2) {return false };
    const splitSnrName: string[] =  displayname.toLowerCase().split('.');
    const name: string = splitSnrName && splitSnrName.length > 1 ? splitSnrName[0] : "";
    return ValidateUserName(name);
}
export function ValidateUserName(username): boolean{
    const processed: string = username.toLowerCase().replace(/\s/g, '');
    const matches: RegExpMatchArray = processed.match('[a-zA-Z0-9]+$');
    return matches.length > 0 ;
}

export function ValidateDisplayName(displayname): string {
    return displayname.toLowerCase().split('.')[0];
}
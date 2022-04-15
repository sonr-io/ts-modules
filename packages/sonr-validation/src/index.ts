export function ValidateUserName(username): string {
    const processed = username.toLowerCase().replace(/\s/g, '');
    return processed;
}

export function ValidateDisplayName(displayname):string {
    return displayname.toLowerCase().split('.')[0];
}
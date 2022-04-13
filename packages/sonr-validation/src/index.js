export function ValidateUserName(username) {
    const processed = username.toLowerCase().replace(/\s/g, '');
    return processed;
}

export function ValidateDisplayName(displayname) {
    return displayname.toLowerCase();
}
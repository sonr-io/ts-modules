export interface User {
    /**
     * User ID according to the Relying Party.
     */
    id: string;
    /**
     * User Name according to the Relying Party.
     */
    name: string;
    /**
     * Display Name of the user.
     */
    displayName: string;
    /**
     * User's icon url.
     */
    iconURL: string;
    /**
     * Credentials owned by the user.
     */
    credentials: Credential[];
  }
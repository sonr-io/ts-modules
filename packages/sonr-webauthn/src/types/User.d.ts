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
     * User's icon url. (not yet supported)
     */
    iconURL: string;
  }
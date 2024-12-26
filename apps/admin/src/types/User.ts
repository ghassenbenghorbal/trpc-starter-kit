export interface UserPermission {
    read?: boolean;
    write?: boolean;
}

export interface UserPermissions {
    analytics?: UserPermission;
    stores?: UserPermission;
    errorLogs?: UserPermission;
    users?: UserPermission;
    orders?: UserPermission;
    tracks?: UserPermission;
    payments?: UserPermission;
}

export type User = {
    _id: string;
    email: string;
    firstname: string;
    lastname: string;
    password?: string;
    image: { sm: string; md: string; lg: string };
    permissions: object;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
};

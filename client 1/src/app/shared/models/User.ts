export interface User {
    _id?: string;
    name?: string;
    mobile?: number;
    email?: string;
    password?: string;
    dob?: Date;
    role?: string;
    gender?: string;
    registeredOn?: Date;
    fatherHusbandName?: string;
    caste?: string;
    addedBy?: string;
    maritialStatus?: string;
    highestEducation?: string;
    fees?: number;
    address?: Address;
}

export interface Address {
    addressLine?: string;
    city?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: number;
}

export interface Fathers {
    name?: string;
    fatherDetails?: [
        {
            name?: string,
            commission?: number,
            income?: 0,
            level?: string,
            total?: number
        }
    ];
}

export interface Month {
    name?: string;
    index?: number;
}
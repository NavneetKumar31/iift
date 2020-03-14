export interface SelledProduct {
    _id?: string;
    name?: string;
    quantity?: number;
    unit_price?: number;
    total_price?: number;
    date_of_sell?: Date;
    description?: string;
}

export interface AddedMember {
    _id?: string;
    name?: string;
    email?: string;
    fees?: number;
    date_of_added?: Date;
}

export interface Spend {
    _id?: string;
    name?: string;
    description?: string;
    type?: string;
    amount?: number;
    date_of_spend?: Date;
}

export interface Account {
    _id?: string;
    name?: string;
    email?: string;
    total_earn_amount?: number;
    total_spend_amount?: number;
    addedMembers?: AddedMember[];
    selledProducts?: SelledProduct[];
    spends?: Spend[];
    modifiedOn?: Date;
}

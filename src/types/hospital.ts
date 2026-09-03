export type CreateHospitalRequest = {
    code: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    facilities?: Record<string, unknown> | string;
};

export type HospitalData = {
    id: string;
    code: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    phone: string;
    description: string;
    facilities: string;
    is_active: boolean;
    created_at: string;
};

export type CreateHospitalAdminRequest = {
    email: string;
    username: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    gender: "L" | "P";
    nik: string;
};

export type CreateHospitalStaffRequest = {
    role: string;
    email: string;
    username: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    gender: "L" | "P";
    nik: string;
};
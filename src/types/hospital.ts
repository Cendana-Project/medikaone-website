export type HospitalFacility = {
    code: string;
    name: string;
    icon?: string;
};

export type HospitalOpeningHour = {
    day_of_week: number;
    is_closed?: boolean;
    is_24_hours?: boolean;
    periods?: Array<{
        open_time?: string;
        close_time?: string;
    }>;
};

export type HospitalImage = {
    id: string;
    hospital_id: string;
    url: string;
    caption?: string;
    sort_order?: number;
    is_cover?: boolean;
    file_size?: number;
    content_type?: string;
    expires_at?: string;
    created_at?: string;
};

export type UploadHospitalImagePayload = {
    image: File;
    caption?: string;
    sort_order?: number;
    is_cover?: boolean;
};

export type UpdateHospitalImagePayload = {
    caption?: string;
    sort_order?: number;
    is_cover?: boolean;
};

export type CreateHospitalRequest = {
    code: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    email?: string;
    website?: string;
    established_year?: number;
    timezone?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    facilities?: HospitalFacility[] | Record<string, unknown> | string;
    opening_hours?: HospitalOpeningHour[];
};

export type HospitalData = {
    id: string;
    code: string;
    name: string;
    address: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    email?: string;
    website?: string;
    established_year?: number;
    timezone?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    facilities?: HospitalFacility[] | string;
    opening_hours?: HospitalOpeningHour[];
    rating_average?: number;
    rating_count?: number;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
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
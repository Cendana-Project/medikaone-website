export type LoginRequest = {
    identifier: string, 
    password: string, 
    hospital_code: string
}

export type RegisterHospitalAdminRequest = {
    email: string;
    username: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
    dob: string;
    address: string;
    gender: "L" | "F";
    nik: string;
}

export type RegisterStaffRequest = {
    role: "nurse" | "receptionist" | "bod" | "doctor";
    email: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
};

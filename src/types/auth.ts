export type LoginHospitalRequest = {
    identifier: string, 
    password: string, 
    hospital_code: string
}

export type LoginRequest = {
    identity: string;
    password: string;
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
    gender: "L" | "P";
    nik: string;
}

export type RegisterAdminForm = RegisterHospitalAdminRequest & {
    hospitalId: string;
    confirmPassword: string;
};

export type RegisterStaffRequest = {
    role: "nurse" | "receptionist" | "bod" | "doctor";
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

export type RegisterStaffForm = RegisterStaffRequest & {
    hospitalId: string;
    confirmPassword: string;
};

export type forgetPasswordRequest = {
    email: string;
}

export type changePasswordRequest = {
    email: string;
    pin: string;
    new_password: string;
}
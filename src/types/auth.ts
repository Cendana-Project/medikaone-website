export type LoginHospitalRequest = {
    identifier: string;
    password: string;
    hospital_code: string;
};

export type LoginRequest = {
    identity: string;
    password: string;
};

export type LoginHospitalResponseData = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    hospital_id: string;
    role: string;
    access_token_expired_at: string;
    refresh_token_expired_at: string;
};

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
};

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
};

export type verifyPinRequest = {
    challenge_id: string;
    email: string;
    pin: string;
};

export type changePasswordRequest = {
    challenge_id: string;
    reset_token: string;
    new_password: string;
};

export type UserHospital = {
    id: string;
    code: string;
    name: string;
};

export type UserData = {
    id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: "L" | "P" | "F";
    dob: string;
    address: string;
    status: string;
    role: string;
    verified_at: string;
    hospitals?: UserHospital[];
};
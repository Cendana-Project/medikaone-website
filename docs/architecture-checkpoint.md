# MedikaOne Architecture Checkpoint & Knowledge Summary

> **Purpose**: Snapshot of the MedikaOne frontend architecture, component layout, route management, validation rules, and data flow to avoid redundant full-project scans.

---

## 1. Project Overview & Tech Stack
- **Framework**: Next.js 15.5.25 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, Vanilla CSS, Lucide React Icons
- **State & Data Fetching**: `@tanstack/react-query` (v5), Axios, `js-cookie`
- **Form Management**: `react-hook-form`, `zod` validation resolvers
- **Authentication**: JWT Bearer Tokens with Refresh Token Rotation (`idempotency_key` UUID v4)

---

## 2. Directory Structure & Key Files

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx               # Login page (/login)
│   │   ├── forgot-password/page.tsx     # 3-step password reset (/forgot-password)
│   │   └── layout.tsx                   # Auth carousel layout with route guard
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx           # Primary dashboard page (/dashboard, redirects to /dashboard/roles)
│   │   ├── doctors/page.tsx             # Kelola Dokter (/doctors)
│   │   ├── departments/page.tsx         # Kelola Departemen (/departments)
│   │   ├── rooms/page.tsx               # Kelola Ruangan (/rooms)
│   │   └── layout.tsx                   # Shared dashboard sidebar & top navbar layout
│   ├── dashboard/
│   │   ├── page.tsx                     # Main dashboard entry (Auto-redirect to /dashboard/roles)
│   │   ├── profile/page.tsx             # User Profile & Hospital Info (/dashboard/profile)
│   │   ├── roles/page.tsx               # Role & Staff RS Management (/dashboard/roles)
│   │   └── system/page.tsx              # System Settings page (/dashboard/system)
│   ├── profile/page.tsx                 # Fallback Redirect Page (/profile -> /dashboard/profile)
│   ├── forbidden/page.tsx               # 403 Access Forbidden fallback page (/forbidden)
│   ├── layout.tsx                       # Root layout wrapped in QueryClientProvider
│   └── page.tsx                         # Root redirect (/ -> /dashboard/roles or /login)
├── components/
│   ├── app-sidebar.tsx                  # 240px Sidebar with role-based navigation & profile card
│   ├── auth/
│   │   ├── authCarousel.tsx             # Auth promotional carousel
│   │   └── TermsModal.tsx               # Clean Terms & Privacy modal dialog
│   ├── dashboard/
│   │   ├── RegisterStaffHospitalModal.tsx # Redesigned Staff Registration Popup Modal
│   │   ├── RegisterAdminHospitalModal.tsx # Redesigned Hospital Admin Registration Popup Modal
│   │   ├── RegisterHospitalModal.tsx      # Redesigned New Hospital Registration Popup Modal
│   │   ├── dashboardTable.tsx           # Staff & User Table Component
│   │   ├── dashboardCards.tsx           # Role count statistics cards
│   │   └── deleteUser.tsx               # Delete user modal
│   ├── profile/
│   │   ├── ProfileForm.tsx              # Editable profile form with read-only fields & hospital tenant info
│   │   ├── EditProfileModal.tsx         # Edit Profile & Photo upload modal
│   │   └── AvatarCropModal.tsx          # Canvas crop viewfinder modal with zoom & drag
│   └── ui/
│       ├── confirm-modal.tsx            # Generic clean confirmation popup modal
│       └── sidebar.tsx                  # Base sidebar UI primitive (240px width)
├── hooks/
│   ├── auth/
│   │   ├── useGetUserInfo.ts            # Cached hook for /tenant/me & /profile/photo
│   │   ├── useLoginHospital.ts          # Mutation for hospital login
│   │   ├── useRegisterStaffHospital.ts  # Staff registration mutation
│   │   ├── useRegisterAdmin.ts          # Hospital Admin registration mutation
│   │   ├── useForgotPassword.ts         # Step 1 request PIN
│   │   ├── useVerifyPin.ts              # Step 2 verify 6-box PIN
│   │   └── useChangePassword.ts         # Step 3 reset password
│   ├── hospital/
│   │   ├── useGetHospitals.ts           # React Query hook for GET /v1/hospitals
│   │   └── useRegisterHospital.ts       # Hospital registration mutation
│   └── profile/                         # Profile update & photo mutations
├── services/
│   ├── AuthService.tsx                  # API endpoints for login, logout, tenant/me, password reset
│   ├── ProfileService.ts                # API endpoints for GET/PATCH profile, PUT/DELETE photo
│   ├── HospitalService.ts               # API endpoints for hospital listing & registration
│   └── DoctorRegistrationService.ts    # API endpoints for doctor invitations & status
├── lib/
│   ├── api.ts                           # Base Axios instance with request/response refresh token queue
│   ├── queryClient.ts                   # TanStack QueryClient with 5m caching & no window refetch
│   ├── handleError.ts                   # Centralized API error toast handler (Indonesian notifications)
│   └── safeRequest.ts                   # Standard API response wrapper
├── validation/                          # Zod schemas for auth, login, register, password complexity
├── types/                               # TypeScript definitions for Auth, Profile, Hospital
└── middleware.ts                        # Next.js Server Guard checking accessToken || refreshToken
```

---

## 3. Role-Based Navigation & Route Mapping

| Role Key | Sidebar Navigation Menu | Settings Path | Profile Card Display Name |
| :--- | :--- | :--- | :--- |
| `SUPER_ADMIN` | Kelola Role (`/dashboard/roles`), Kelola Doctor (`/doctors`) | `/dashboard/profile` | **Super Admin** |
| `ADMIN` / `HOSPITAL_ADMIN` | Kelola Role (`/dashboard/roles`), Kelola Doctor (`/doctors`) | `/dashboard/profile` | **Admin Dashboard** |
| `RECEPTIONIST` | Data Appointment (`/appointments`), Chat (`/chat`), Cek Jadwal Dokter (`/doctor-schedule`) | `/dashboard/profile` | **Resepsionis** |
| `NURSE` | Antrian Pasien (`/queue`), Detail Pasien (`/patients`) | `/dashboard/profile` | **Pegawai Perawat** |
| `BOD` | Data User (`/users`), Riwayat Pemasukan (`/revenue`) | `/dashboard/profile` | **Board of Director** |
| `DOCTOR` | Dashboard (`/dashboard`), Appointment (`/appointments`) | `/dashboard/profile` | **Dokter** |

---

## 4. Form Validation & Password Complexity Rules

- **Email**: Wajib, format email valid, maksimal 190 karakter.
- **Username**: Wajib, 3–64 karakter, diawali alfanumerik `[a-zA-Z0-9._-]`.
- **Password**: Wajib, 8–128 karakter dengan aturan kompleksitas:
  - Memiliki minimal 1 Huruf Besar (Uppercase)
  - Memiliki minimal 1 Huruf Kecil (Lowercase)
  - Memiliki minimal 1 Angka (Digit)
  - Memiliki minimal 1 Karakter Spesial
  - Dilarang memuat 4 angka berurutan (misal `1234` atau `9876`)
  - Dilarang memuat 4 karakter sama berturut-turut (misal `aaaa`, `1111`)
  - Dilarang memuat username atau bagian email
- **No. Telepon / Phone**: Opsional, maksimal 32 karakter, otomatis me-refresh sanitasi awalan angka `1` di depan `+62` atau `0`.
- **Tanggal Lahir (dob)**: Opsional, format `YYYY-MM-DD`, **minimal berusia 15 tahun**, tidak boleh di masa depan.
- **NIK**: Opsional, tepat 16 digit angka.

---

## 5. UI Form Modal Design Language
Seluruh modal pendaftaran pada Dashboard (`RegisterStaffHospitalModal`, `RegisterAdminHospitalModal`, `RegisterHospitalModal`) mengikuti spesifikasi *Modern UI Mockup*:
- **Header**: Judul besar bold (`text-2xl font-bold text-gray-900`), subjudul deskripsi (`text-sm text-gray-500`), pembatas horizontal `border-b border-gray-100 pb-4`.
- **Input Fill Style**: Background soft `bg-[#F8FAFC]`, border `border-gray-200`, tinggi `h-11`, sudut `rounded-xl`.
- **Footer Buttons**: Layout `justify-between` dengan tombol **`Batalkan`** (outline border, kiri) dan **`Daftar Akun`** (teal `#3BB49F`, kanan).
- **Confirmation Flow**: Menggunakan `ConfirmModal.tsx` popup sebelum mengeksekusi request registrasi ke API backend.

---

## 6. Route Protection & Middleware Rules
- Next.js `middleware.ts` mengawasi seluruh rute yang dilindungi (`/dashboard`, `/dashboard/roles`, `/dashboard/profile`, dll).
- Status autentikasi diverifikasi berdasarkan keberadaan `accessToken || refreshToken`.
- Rute guest seperti `/login` dan `/forgot-password` akan otomatis mengalihkan user yang sudah login ke `/dashboard`.

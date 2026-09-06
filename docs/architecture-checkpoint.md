# MedikaOne Architecture Checkpoint & Knowledge Summary

> **Purpose**: Snapshot of the MedikaOne frontend architecture, component layout, route management, and data flow to avoid redundant full-project scans.

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
│   │   ├── change-password/             # Change password page (/change-password)
│   │   ├── register/                    # Staff & hospital admin registration (/register/*)
│   │   └── layout.tsx                   # Auth carousel layout with route guard
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx           # Primary dashboard page (/dashboard)
│   │   ├── roles/page.tsx               # Kelola Role Pegawai (/roles)
│   │   ├── doctors/page.tsx             # Kelola Dokter (/doctors)
│   │   ├── departments/page.tsx         # Kelola Departemen (/departments)
│   │   ├── rooms/page.tsx               # Kelola Ruangan (/rooms)
│   │   ├── profile/page.tsx             # User profile page (/profile)
│   │   ├── system/page.tsx              # System setting page (/system)
│   │   └── layout.tsx                   # Shared dashboard sidebar & top navbar layout
│   ├── forbidden/page.tsx               # 403 Access Forbidden fallback page (/forbidden)
│   ├── layout.tsx                       # Root layout wrapped in QueryClientProvider
│   └── page.tsx                         # Root redirect (/ -> /dashboard or /login)
├── components/
│   ├── app-sidebar.tsx                  # 240px Sidebar with role-based navigation & profile card
│   ├── auth/
│   │   ├── authCarousel.tsx             # Auth carousel
│   │   ├── TermsModal.tsx               # Clean Terms & Privacy modal dialog
│   │   └── PinInput.tsx                 # 6-box PIN input component
│   ├── profile/
│   │   ├── ProfileForm.tsx              # Editable profile form with read-only fields & save state
│   │   └── AvatarCropModal.tsx          # Canvas crop viewfinder modal with zoom & drag
│   └── ui/
│       ├── confirm-modal.tsx            # Generic clean confirmation popup
│       └── sidebar.tsx                  # Base sidebar UI primitive (240px width)
├── hooks/
│   ├── auth/
│   │   ├── useGetUserInfo.ts            # Cached hook for /tenant/me & /profile/photo
│   │   ├── useLoginHospital.ts          # Mutation for hospital login
│   │   ├── useForgotPassword.ts         # Step 1 request PIN
│   │   ├── useVerifyPin.ts              # Step 2 verify 6-box PIN
│   │   └── useChangePassword.ts         # Step 3 reset password
│   └── doctorRegistration/              # Doctor registration & status update hooks
├── services/
│   ├── AuthService.tsx                  # API endpoints for login, logout, tenant/me, password reset
│   ├── ProfileService.ts                # API endpoints for GET/PATCH profile, PUT/DELETE photo
│   ├── DoctorRegistrationService.ts    # API endpoints for doctor invitations & status
│   └── HospitalService.ts               # API endpoints for hospital administration
├── lib/
│   ├── api.ts                           # Base Axios instance with request/response refresh token queue
│   ├── queryClient.ts                   # TanStack QueryClient with 5-10m caching & no window refetch
│   ├── handleError.ts                   # Centralized API error toast handler (clean Indonesian messages)
│   └── safeRequest.ts                   # Standard API response wrapper
├── validation/                          # Zod schemas for auth, login, register, profile
├── types/                               # TypeScript definitions for Auth, Profile, Hospital
└── middleware.ts                        # Next.js Server Guard checking accessToken || refreshToken
```

---

## 3. Role-Based Navigation & Display Mapping

| Role Key | Normalized Alias | Sidebar Menu Items | Profile Card Display Name |
| :--- | :--- | :--- | :--- |
| `ADMIN` / `HOSPITAL_ADMIN` | `ADMIN` | Kelola Role (`/roles`), Kelola Doctor (`/doctors`), Settings (`/profile`) | **Admin Dashboard** |
| `RECEPTIONIST` / `RESEPSIONIS` | `RECEPTIONIST` | Data Appointment (`/appointments`), Chat (`/chat`), Cek Jadwal Dokter (`/doctor-schedule`), Settings (`/profile`) | **Resepsionis** |
| `NURSE` / `PERAWAT` | `NURSE` | Antrian Pasien (`/queue`), Detail Pasien (`/patients`), Settings (`/profile`) | **Pegawai Perawat** |
| `BOD` | `BOD` | Data User (`/users`), Riwayat Pemasukan (`/revenue`), Settings (`/profile`) | **Board of Director** |
| `DOCTOR` / `DOKTER` | `DOCTOR` | Dashboard (`/dashboard`), Appointment (`/appointments`), Settings (`/profile`) | **Dokter** |
| `SUPER_ADMIN` | `SUPER_ADMIN` | Kelola Role, Kelola Doctor, Tambah RS, Tambah Admin RS, Settings | **Super Admin** |

---

## 4. Route Protection & Middleware Rules
- Next.js `middleware.ts` guards all protected routes (`/dashboard`, `/profile`, `/system`, `/roles`, etc.).
- Authentication status is determined by checking **`accessToken || refreshToken`** cookies.
- If `refreshToken` is present when `accessToken` expires, middleware permits route access, enabling background token refresh via client API interceptors without kicking the user to `/login`.

---

## 5. React Query Caching & Network Optimization
- **Global Settings (`src/lib/queryClient.ts`)**:
  - `staleTime`: `1000 * 60 * 5` (5 minutes).
  - `refetchOnWindowFocus`: `false` (prevents spamming backend on tab switches).
  - `refetchOnMount`: `false`.
- **User & Photo Queries (`src/hooks/auth/useGetUserInfo.ts`)**:
  - `["me"]` and `["profilePhoto"]` set to `staleTime: 1000 * 60 * 10` (10 minutes).
  - Explicit query invalidation (`queryClient.invalidateQueries`) is triggered **only on user demand** when profile photos or profile details are modified/deleted.

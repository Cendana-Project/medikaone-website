# MedikaOne API Integration Rules & Standards

> **Purpose**: Guidelines and standards for API integration in the MedikaOne frontend. Follow these rules for all future backend integrations and feature developments to maintain consistency, token security, and performance.

---

## 1. Axios Architecture & Interceptors (`src/lib/api.ts`)

- **Instances**:
  - `api`: Main instance used for all standard API calls across the application.
  - `refreshApi`: Isolated Axios instance without request/response interceptors specifically reserved for `POST /v1/auth/refresh` to prevent infinite interceptor loops.
- **Header Injection**:
  - `Authorization: Bearer <accessToken>` automatically attached if present and valid.
  - `X-Hospital-ID: <hospitalId>` automatically read from `Cookies.get("hospitalId")` and attached.
- **Excluded Endpoints**:
  - Endpoints matching `auth/login`, `auth/password`, `auth/refresh`, or `auth/logout` are explicitly excluded from auto-refresh request interceptors.
- **Proactive Token Refresh**:
  - Requests evaluate `isTokenExpired(token)` (with a 10-second buffer before JWT expiration) before sending. If expired, `refreshToken()` executes *prior* to sending the request.

---

## 2. Refresh Token Rotation & Session Management

- **Endpoint**: `POST /v1/auth/refresh`
- **Request Body**:
  ```json
  {
    "refresh_token": "current-refresh-token",
    "idempotency_key": "uuid-v4-string"
  }
  ```
- **Idempotency Key**: Must be generated using standard UUID v4 format (`crypto.randomUUID()`).
- **Cookie Expiration Alignment**:
  - `localStorage.getItem("remember_me_preference")` stores user preference (`"true"` / `"false"`).
  - If `true`: `accessToken` expires in 7 days, `refreshToken` expires in 30 days.
  - If `false`: Session-based cookies (cleared on browser close).
- **Session Expiry Handling**:
  - If refresh fails or token is invalid, clear cookies (`accessToken`, `refreshToken`, `hospitalId`, `userId`), display `toast.error("Session expired, please login again.")`, and redirect to `/login`.

---

## 3. Response Wrapping & Error Handling

### `safeRequest<T>()` (`src/lib/safeRequest.ts`)
Wrap service API calls to return structured, type-safe results:
```typescript
const result = await safeRequest(api.get("/tenant/me"));
if (result.error) {
  // Handle error cleanly
}
const userData = result.data;
```

### `handleApiError()` (`src/lib/handleError.ts`)
- Never display raw backend JSON error messages or raw stack traces directly in UI toasts.
- Pass errors to `handleApiError(err, fallbackMessage)` for mapped, user-friendly Indonesian messages:
  - `400`: Validation error / bad request
  - `401`: Unauthorized / session expired
  - `403`: Access forbidden
  - `404`: Resource not found
  - `409`: Data conflict / already exists
  - `422`: Processing error
  - `500+`: Server error message

---

## 4. TanStack React Query Caching Standards (`src/lib/queryClient.ts`)

- **Global Defaults**:
  ```typescript
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,         // 5 minutes stale time
      gcTime: 1000 * 60 * 15,            // 15 minutes garbage collection time
      refetchOnWindowFocus: false,      // DO NOT refetch on tab switch
      refetchOnMount: false,            // DO NOT refetch on component remount if fresh
      retry: 1,                         // Single retry on failure
    }
  }
  ```
- **User & Profile Caching (`useGetUserInfo.ts`)**:
  - `["me"]` and `["profilePhoto"]` queries use `staleTime: 10 minutes`.
  - Continuous network spam on `GET /v1/tenant/me` and `GET /v1/profile/photo` is prevented.
  - **Explicit Invalidation & Mutations (`src/hooks/profile/useProfileMutations.ts`)**:
    - `useUpdateProfile()`: Triggers `queryClient.invalidateQueries({ queryKey: ["me"] })` on successful profile edit.
    - `useUploadProfilePhoto()`: Triggers `queryClient.invalidateQueries({ queryKey: ["profilePhoto"] })` and `["me"]` on photo upload.
    - `useDeleteProfilePhoto()`: Triggers `queryClient.invalidateQueries({ queryKey: ["profilePhoto"] })` and `["me"]` on photo deletion.

---

## 5. Service & Mutation Layer Pattern

1. **Services (`src/services/`)**:
   - Pure functions accepting request parameters and returning Axios promises wrapped with `safeRequest`.
   - Organized by feature (e.g. `AuthService.ts`, `ProfileService.ts`, `HospitalService.ts`, `DoctorRegistrationService.ts`).
2. **Hooks (`src/hooks/`)**:
   - Encapsulate `useQuery` or `useMutation` calls.
   - Profile mutation hooks (`useProfileMutations.ts`) handle automatic query invalidation so backend changes take immediate effect in the UI.
   - Return clean interface `{ data, isLoading, isError, mutateAsync, ... }`.

# Authentication Flow

## Complete Flow

### 1. Registration Flow
```
Register Screen → Fill Form → Submit
  ↓
Backend returns: { userId: "..." }
  ↓
Navigate to OTP Screen with userId
  ↓
Enter OTP → Verify
  ↓
Success → Navigate to Login Screen
```

### 2. Login Flow
```
Login Screen → Enter credentials → Submit
  ↓
Backend returns:
{
  "success": true,
  "code": 201,
  "message": "Login successful",
  "data": {
    "accessToken": "...",
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "phoneNumber": "...",
      "role": "TENANT" or "ADMIN"
    }
  }
}
  ↓
Store in Redux:
- token: data.accessToken
- user: data.user
- role: data.user.role
- isAuthenticated: true
  ↓
AppNavigator detects isAuthenticated = true
  ↓
Navigate based on role:
- TENANT → TenantRouter (Tenant screens)
- ADMIN → AdminRouter (Admin screens)
```

## Redux State Structure

```javascript
{
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "5184efa1-5c9d-4387-a7ea-b5da0bb1d43e",
      name: "John Doe",
      email: "jijiji@yopmail.com",
      phoneNumber: "+3987654346",
      role: "TENANT"
    },
    role: "TENANT",
    isAuthenticated: true
  }
}
```

## Automatic Token Injection

The axios interceptor automatically adds the token to all API requests:

```javascript
// Request interceptor reads token from Redux
const token = storeRef.getState().auth?.token;
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## Role-Based Navigation

### AppNavigator Logic
```javascript
if (!isAuthenticated) {
  return <UnauthRouter />; // Login, Register, OTP
}

// User is authenticated
if (role === "ADMIN") {
  return <AdminRouter />; // Admin screens
}

if (role === "TENANT") {
  return <TenantRouter />; // Tenant screens
}
```

## Logout Flow

### Manual Logout
```javascript
const { mutate: logout } = useLogout();
logout();
```

### Automatic Logout (401 Error)
When any API returns 401:
1. Shows "Session Expired" alert
2. Clears Redux state (token, user, role)
3. Sets isAuthenticated = false
4. Redirects to Login screen

## API Response Handling

### Login Response Structure
```json
{
  "success": true,
  "code": 201,
  "message": "Login successful",
  "data": {
    "accessToken": "JWT_TOKEN",
    "user": {
      "id": "UUID",
      "name": "User Name",
      "email": "user@example.com",
      "phoneNumber": "+1234567890",
      "role": "TENANT" | "ADMIN"
    }
  }
}
```

### Hook Handling
```javascript
export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const data = response.data || response;
      
      dispatch(setCredentials({
        token: data.accessToken || data.token,
        user: data.user,
        role: data.user?.role || data.role,
      }));
    },
  });
};
```

## Screen Navigation

### Unauthenticated Screens
- Login
- Register
- OTP

### Tenant Screens
- TenantHome
- TenantDashboard
- Profile

### Admin Screens
- AdminHome
- AdminDashboard
- AdminUsers
- Profile

## Key Features

✅ Automatic role-based navigation
✅ Token stored in Redux
✅ Token auto-injected in API requests
✅ Auto-logout on 401 errors
✅ Centralized error handling
✅ OTP verification flow
✅ Secure authentication flow

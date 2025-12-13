# Centralized Error Handling

## Overview
All API errors are now handled centrally in `src/api/axiosConfig.js` using a switch statement based on HTTP status codes.

## Features

### ✅ Automatic Error Alerts
All API errors automatically show user-friendly alerts without needing error handling in each screen.

### ✅ Status Code Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Clear auth state & redirect to login |
| 403 | Forbidden | Show access denied message |
| 404 | Not Found | Show resource not found |
| 409 | Conflict | Show conflict message |
| 422 | Unprocessable Entity | Show validation errors |
| 429 | Too Many Requests | Show rate limit message |
| 500 | Internal Server Error | Show server error message |
| 502-504 | Service Unavailable | Show service unavailable |
| Network Error | No connection | Show network error |

### ✅ 401 Unauthorized Flow
When a 401 error occurs:
1. Shows "Session Expired" alert
2. Clears Redux auth state (logout)
3. Redirects to Login screen
4. User must login again

### ✅ Error Message Formatting
Automatically handles backend error formats:
```json
{
  "errors": ["Error 1", "Error 2"],  // Array of errors
  "message": "Single error message",  // Single message
  "error": "Error string"             // Alternative format
}
```

## Usage in Screens

### Before (Manual Error Handling)
```javascript
onError: (error) => {
  const errorData = error.response?.data;
  let errorMessage = 'Failed';
  
  if (errorData?.errors && Array.isArray(errorData.errors)) {
    errorMessage = errorData.errors.join('\n');
  } else if (errorData?.message) {
    errorMessage = errorData.message;
  }
  
  Alert.alert('Error', errorMessage);
}
```

### After (Centralized)
```javascript
onError: (error) => {
  // Error is already handled by axios interceptor
  console.log('Operation failed');
}
```

## Logging

### Request Logging
```
📤 API Request: {
  method: 'POST',
  url: '/auth/login',
  data: { email: '...', password: '...' }
}
```

### Success Logging
```
✅ API Success: {
  url: '/auth/login',
  status: 200
}
```

### Error Logging
```
❌ API Error: {
  status: 400,
  url: '/auth/register',
  data: { errors: ['Email already exists'] }
}
```

## Configuration

### Set API Base URL
Edit `src/api/axiosConfig.js`:
```javascript
const API_BASE_URL = "http://10.0.2.2:3000/api/v1";
```

### Navigation & Store Setup
Already configured in `App.js`:
- Navigation ref for redirects
- Store ref for logout action

## Benefits

1. **DRY Code** - No repetitive error handling
2. **Consistent UX** - Same error messages everywhere
3. **Easy Maintenance** - Update error handling in one place
4. **Auto Logout** - Handles expired sessions automatically
5. **Better Logging** - All requests/responses logged
6. **User Friendly** - Clear, formatted error messages

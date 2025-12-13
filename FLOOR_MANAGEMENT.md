# Floor Management System

## Features

### ✅ Complete CRUD Operations
- **Create** - Add new floors
- **Read** - View all floors with room count
- **Update** - Edit existing floors
- **Delete** - Remove floors with confirmation

## API Integration

### Endpoints Used
```
GET    /pg-floor          - Get all floors
GET    /pg-floor/:id      - Get single floor
POST   /pg-floor          - Create floor (Admin only)
PATCH  /pg-floor/:id      - Update floor (Admin only)
DELETE /pg-floor/:id      - Delete floor (Admin only)
```

### Request/Response Format

**Create Floor:**
```json
POST /pg-floor
{
  "floorNumber": 1
}
```

**Update Floor:**
```json
PATCH /pg-floor/:id
{
  "floorNumber": 2
}
```

## UI Features

### Main Screen
- **Header** with title and + button
- **Floor Cards** showing:
  - Floor icon with blue background
  - Floor number (e.g., "Floor 1")
  - Room count (e.g., "5 rooms")
  - Edit button (pencil icon)
  - Delete button (trash icon)
- **Empty State** when no floors exist
- **Pull to Refresh** functionality
- **Loading State** with spinner

### Add/Edit Modal
- **Bottom Sheet** style modal
- **Form Fields:**
  - Floor Number (number input)
  - Real-time validation
  - Error messages
- **Buttons:**
  - Close (X icon)
  - Submit (Create/Update)
  - Loading state during submission

### Validation
- Floor number is required
- Must be a positive integer
- Backend checks for duplicates

### User Experience
- **Smooth animations** (slide-up modal)
- **Confirmation dialog** before delete
- **Auto-refresh** after create/update/delete
- **Error handling** via centralized axios interceptor
- **Loading states** for all operations
- **Empty state** with helpful message

## File Structure

```
src/
├── api/
│   └── services/
│       └── floorService.js          # API calls
├── hooks/
│   └── useFloors.js                 # React Query hooks
├── validations/
│   └── floorSchema.js               # Yup validation
└── screens/
    └── adminScreens/
        └── services/
            └── FloorsScreen.js      # Main UI component
```

## Hooks Available

```javascript
// Get all floors
const { data: floors, isLoading, refetch } = useFloors();

// Get single floor
const { data: floor } = useFloor(id);

// Create floor
const { mutate: createFloor, isPending } = useCreateFloor();

// Update floor
const { mutate: updateFloor, isPending } = useUpdateFloor();

// Delete floor
const { mutate: deleteFloor, isPending } = useDeleteFloor();
```

## Usage Example

```javascript
// Create
createFloor({ floorNumber: 1 }, {
  onSuccess: () => console.log('Created'),
  onError: () => console.log('Failed'),
});

// Update
updateFloor({ id: 'uuid', data: { floorNumber: 2 } }, {
  onSuccess: () => console.log('Updated'),
});

// Delete
deleteFloor('uuid', {
  onSuccess: () => console.log('Deleted'),
});
```

## Design System

### Colors
- Primary: #007AFF (Blue)
- Danger: #FF3B30 (Red)
- Background: #F5F5F5 (Light Gray)
- Card: #FFFFFF (White)
- Text: #333333 (Dark Gray)
- Meta: #666666 (Gray)
- Border: #DDDDDD (Light Gray)

### Spacing
- Container padding: 20px
- Card margin: 12px
- Card padding: 16px
- Icon size: 24px
- Button size: 44x44px

### Typography
- Title: 28px, bold
- Card title: 18px, semibold
- Meta text: 14px, regular
- Button text: 16px, semibold

## Error Handling

All errors are handled centrally by axios interceptor:
- 400 - Validation errors (e.g., "Floor already exists")
- 401 - Unauthorized (redirects to login)
- 404 - Floor not found
- 500 - Server error

## Security

- All create/update/delete operations require ADMIN role
- Token automatically added to requests
- Role-based access control on backend

## Next Steps

Apply the same pattern to:
- Room Types
- Rooms
- Beds

Each will have similar CRUD operations with their own validation schemas and API endpoints.

# Lost Items Management System

This document describes the Lost Items Management feature added to the Unity Portal System.

## Overview

The Lost Items Management System allows students to report lost items and claim found items, while administrators can manage all lost and found items through a comprehensive dashboard.

## Features

### For Students
- **View Lost Items**: Browse through all reported lost and found items
- **Report Lost Items**: Submit detailed reports of lost items with images
- **Claim Found Items**: Claim items that have been found
- **Search & Filter**: Search by item name, description, or location
- **Filter by Category**: Filter by electronics, clothing, books, accessories, documents, or other
- **Filter by Status**: Filter by lost, found, or claimed status

### For Administrators
- **Complete Management**: Full CRUD operations for all lost items
- **Statistics Dashboard**: Overview of total items, lost count, found count, and claimed count
- **Advanced Filtering**: Search and filter capabilities with pagination
- **Status Management**: Update item status (lost → found → claimed)
- **Image Management**: Handle item images with automatic file management
- **User Tracking**: Track who reported and claimed items

## Database Schema

### Lost Items Table
```sql
CREATE TABLE lost_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('electronics', 'clothing', 'books', 'accessories', 'documents', 'other') NOT NULL,
    location VARCHAR(255) NOT NULL,
    date_lost DATE NOT NULL,
    contact_info VARCHAR(255),
    image_path VARCHAR(500),
    status ENUM('lost', 'found', 'claimed') DEFAULT 'lost',
    reported_by INT NOT NULL,
    claimed_by INT NULL,
    claimer_name VARCHAR(255),
    claimer_contact VARCHAR(255),
    claim_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (claimed_by) REFERENCES users(id) ON DELETE SET NULL
);
```

## API Endpoints

### GET /api/lost-items
- **Description**: Get all lost items with pagination and filtering
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `status`: Filter by status (lost, found, claimed)
  - `category`: Filter by category
  - `search`: Search term for item name, description, or location
- **Response**: Paginated list of lost items with metadata

### GET /api/lost-items/:id
- **Description**: Get specific lost item by ID
- **Response**: Single lost item with full details

### POST /api/lost-items
- **Description**: Create new lost item report
- **Body**: Form data with item details and optional image
- **Response**: Created item ID and success message

### PUT /api/lost-items/:id
- **Description**: Update existing lost item
- **Body**: Form data with updated item details
- **Response**: Success message

### DELETE /api/lost-items/:id
- **Description**: Delete lost item
- **Response**: Success message

### POST /api/lost-items/:id/claim
- **Description**: Claim a found item
- **Body**: Claimer name and contact information
- **Response**: Success message

### GET /api/lost-items/stats/overview
- **Description**: Get statistics overview
- **Response**: Total items, counts by status, and category breakdown

## File Structure

```
src/
├── pages/
│   ├── Admin/
│   │   └── LostItems.jsx          # Admin lost items management page
│   └── Student/
│       └── LostItems.jsx          # Student lost items page
├── components/
│   └── Layout/
│       └── Sidebar.jsx            # Updated with lost items navigation
└── App.jsx                        # Updated with new routes

backend/
├── routes/
│   └── lostItems.js               # Lost items API routes
├── server.js                      # Updated with lost items route
└── uploads/
    └── lost-items/                # Directory for lost item images
```

## Setup Instructions

### 1. Database Setup
Run the SQL script to add the lost items table:
```bash
mysql -u your_username -p your_database < add_lost_items_table.sql
```

### 2. Backend Setup
The lost items API routes are already integrated into the main server. No additional setup required.

### 3. Frontend Setup
The lost items pages are already integrated into the React application. No additional setup required.

### 4. File Uploads
Ensure the backend has write permissions to the `uploads/lost-items/` directory:
```bash
mkdir -p backend/uploads/lost-items
chmod 755 backend/uploads/lost-items
```

## Usage

### For Students
1. Navigate to "Lost & Found" in the sidebar
2. Browse through reported items or use search/filter options
3. Click "Report Lost Item" to submit a new report
4. Click "Claim" on found items to claim them
5. Click "View" to see detailed information about any item

### For Administrators
1. Navigate to "Lost Items" in the admin sidebar
2. View statistics dashboard for overview
3. Use search and filter options to find specific items
4. Click "Add Lost Item" to manually add items
5. Use action buttons to view, edit, or delete items
6. Mark items as claimed when students claim them

## Features in Detail

### Image Management
- Supports image uploads for lost items
- Automatic file naming and storage
- Image preview in item listings
- Automatic cleanup when items are deleted

### Status Workflow
1. **Lost**: Initial status when item is reported
2. **Found**: Admin can mark as found when item is located
3. **Claimed**: Item is claimed by the rightful owner

### Search and Filtering
- Full-text search across item name, description, and location
- Category-based filtering
- Status-based filtering
- Pagination for large datasets

### Security
- Authentication required for all operations
- Role-based access control
- File upload validation
- SQL injection prevention

## Customization

### Adding New Categories
To add new item categories, update the `category` ENUM in the database:
```sql
ALTER TABLE lost_items MODIFY COLUMN category ENUM('electronics', 'clothing', 'books', 'accessories', 'documents', 'sports', 'jewelry', 'other');
```

### Modifying Status Options
To add new status options, update the `status` ENUM in the database:
```sql
ALTER TABLE lost_items MODIFY COLUMN status ENUM('lost', 'found', 'claimed', 'returned', 'disposed');
```

### Styling
The components use Tailwind CSS classes and can be customized by modifying the className attributes in the React components.

## Troubleshooting

### Common Issues

1. **Images not displaying**: Check that the backend server is running and the uploads directory exists
2. **File upload errors**: Verify file permissions and file size limits
3. **Database errors**: Ensure the lost_items table exists and foreign key constraints are satisfied

### Debug Mode
Enable debug logging by setting the NODE_ENV environment variable:
```bash
NODE_ENV=development npm start
```

## Future Enhancements

- Email notifications for item status changes
- QR code generation for item tracking
- Mobile app integration
- Advanced reporting and analytics
- Integration with campus security systems
- Automated item matching based on descriptions
- Photo recognition for item identification

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

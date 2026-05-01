# Addiss Rent - Property Rental Platform

A full-stack property rental platform connecting landowners and tenants in Ethiopia. Landowners can post properties for rent, tenants can browse and search for properties, and admins manage approvals and content.

 Features

 Landowner Features
- Register and manage profile
- Post properties with images (up to 10 images)
- Set property-specific contact phone number (Ethio Telecom or Safaricom)
- Edit pending properties
- Edit active properties (requires re-approval)
- Archive/restore properties
- Delete properties
- View all personal properties with status tracking
- Dashboard with property statistics

 Tenant Features
- Browse approved properties
- Advanced search and filtering
  - Search by title, description, or location
  - Filter by price range
  - Filter by location
  - Filter by number of bedrooms
- View property details with image gallery
- Contact landowners via property-specific phone numbers

   Admin Features
- Complete admin dashboard with statistics
- View and manage pending properties
- Approve or reject property listings
- View outdated properties (posted > 1 month)
- Bulk delete outdated properties
- View all users (tenants and landowners)
- Delete any property
- User management

   Security Features
- JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting
- CORS configured
- Helmet.js security headers
- Ethiopian phone number validation

  Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP requests
- **React Hot Toast** - Notifications
- **React Icons** - Icons
- **React Hook Form** - Form handling
- **Date-fns** - Date formatting

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password encryption
- **Cloudinary** - Image upload and storage
- **Multer** - File upload handling
- **Nodemailer** - Email services
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Storage**: Cloudinary

  Prerequisites

- Node.js  
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for nodemailer)

  Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/addiss-rent.git
cd addiss-rent

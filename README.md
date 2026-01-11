# Foodie App - Full Stack

A simple full-stack food items website using React, Node.js, Express, and MongoDB.

## Features
- Add food items with image and name
- View all food items in a grid
- Delete food items
- Image preview before upload
- Dark mode UI

## Prerequisites
- Node.js installed
- MongoDB installed and running locally on default port (27017)

## How to Run

### 1. Start Database
Ensure MongoDB is running:
```bash
mongod
```

### 2. Start Backend
Open a terminal in `backend` folder:
```bash
cd backend
npm run dev
```
*Server runs on http://localhost:5000*

### 3. Start Frontend
Open a new terminal in `frontend` folder:
```bash
cd frontend
npm run dev
```
*App runs on http://localhost:5173*

## Image Upload Explanation
1. **Frontend**: User selects a file. The `AddFood` component reads it (for preview) and appends it to a `FormData` object.
2. **Network**: The `FormData` is sent via a POST request to `/api/foods`. Browser sets `Content-Type: multipart/form-data`.
3. **Backend**: 
   - `Multer` middleware intercepts the request.
   - It saves the file to the `uploads/` folder with a unique timestamped name.
   - It adds a `file` object to `req` and text fields to `req.body`.
4. **Database**: We save the generated `filename` in MongoDB.
5. **Serving**: The `uploads` folder is static, so images are accessible at `http://localhost:5000/uploads/<filename>`.

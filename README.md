# Electric Menu Backend

Backend API untuk aplikasi Electric Menu menggunakan Express dan PostgreSQL.

---

## Features

- Authentication (JWT)
- Manage Shops
- Manage Products
- Product Types
- QR Code for shop

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT

---

## API Endpoints

### Auth

**POST** - `POST /api/auth/register-admin`

### Request Body

{
"name" : "John Doe",
"email": "youremail@gmail.com",
"password": "Password123!"
}

### Response

{
"message": "Admin successfully registered",
"name": "John Doe",
"email": "youremail@gmail.com"
}

**POST** - `POST /api/auth/register-user`

### Request Body

{
"name" : "John Doe",
"email": "youremail@gmail.com",
"password": "Password123!"
}

### Response

{
"message": "User successfully registered",
"name": "John Doe",
"email": "youremail@gmail.com"
}

**POST** - `POST /api/auth/verify-otp`

### Request Body

{
"email": "youremail@gmail.com",
"otp": 1111
}

### Response

{
"message": "Email verified successfully"
}

**POST** - `POST /api/auth/resend-otp`

### Request Body

{
"email": "youremail@gmail.com"
}

### Response

{
"message": "OTP resent successfully"
}

**POST** - `POST /api/auth/reset-password-otp`

### Request Body

{
"email": "youremail@gmail.com"
}

### Response

{
"message": "OTP sent to email"
}

**PATCH** - `PATCH /api/auth/reset-password`

### Request Body

{
"email": "youremail@gmail.com",
"otp": 1111,
"password": "Password123!",
"confirmPassword": "Password123!"
}

### Response

{
"message": "Password successfully changed"
}

**POST** - `POST /api/auth/login`

### Request Body

{
"email": "youremail@gmail.com",
"password": "Password123!"
}

### Response

{
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjsada17bWFpbCI6ImFuZ2dhc2lhZ2lhbjE3QGdtYWlsLmNvbSIsInJvbGVfaWQiOjEsImlhdCI6MTc3MjcxNDAzMSwiZXhwIjoxNzcyNzE3NjMxLCJpc3MiOi1WaR1sda1hcGkifQ.92p2aSeMGarEiLSsGVZV7Dgdhxy7osVm0As0f77Bjlg",
"emailVerified": true,
"user": {
"name": "John Doe",
"email": "youremail@gmail.com",
"role_id": 1
}
}

### Shop

**POST** - `POST /api/shop/create-shop`

### Request Body

{
"email": "youremail@gmail.com",
"password": "Password123!"
}

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Shop create sucessfully",
"shop": {
"shop_name": "Your Shop",
"shop_slug": "your-shop-6b86b273",
"qr_url": "http://BASE_URL/qr/your-shop-6b86b273.png"
}
}

**GET** - `POST /api/shop/:id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"shop": {
"id": 1,
"shop_name": "Your Shop",
"shop_slug": "your-shop-6b86b273",
"qr_url": "http://localhost:3000/qr/your-shop-6b86b273.png"
}
}

<!-- ### Product

- `GET /api/product/allProduct`
- `POST /api/product/create-product` -->

-->

## Folder Structure

```
backend/
├── src/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    ├── models/
    └── utils/
├── uploads/
    ├──product_image/
    └──qr_image/
├── server.js
└── package.json
```

---

## Author

Ray Siagian

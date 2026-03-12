### Shop

**USER**

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

**GET** - `GET /api/shop/:id`

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

**DELETE** - `DELETE /api/shop/delete-shop/:id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"confirm_shop_name" : "Your Shop"
}

### Response

{
"message": "Shop deleted sucessfully"
}

**GET** - `GET /api/shop/search/`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Shops retrieved successfully",
"shops": [
{
"id": 1,
"shop_name": "Your Shop",
"shop_slug": "your-shop-2b36mfd73",
"qr_url": "http://localhost:3000/qr/your-shop-2b36mfd73.png",
"created_at": "2026-03-08T03:48:26.445Z"
}
],
"pagination": {
"total": 1,
"page": 1,
"limit": 10,
"total_pages": 1
}
}

**ADMIN**

**GET** - `GET /api/admin/shops/`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"shop": [
{
"id": 1,
"shop_name": "Your Shop",
"shop_slug": "your-shop-6b86b273",
"qr_url": "http://localhost:3000/qr/your-shop-6b86b273.png",
"owner_name": "Ray",
"email": "raysiagian7@gmail.com"
}
]
}

**GET** - `GET /api/admin/shops/user/user_id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"shop": [
{
"id": 1,
"shop_name": "Your Shop",
"shop_slug": "your-shop-6b86b273",
"qr_url": "http://localhost:3000/qr/your-shop-6b86b273.png",
"owner_name": "Ray",
"email": "raysiagian7@gmail.com"
}
]
}

**GET** - `GET /api/admin/shop/search/`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Shops retrieved successfully",
"shops": [
{
"id": 1,
"shop_name": "Your Shop",
"shop_slug": "your-shop-6b86b273",
"qr_url": "http://localhost:3000/qr/your-shop-6b86b273.png",
"created_at": "2026-03-08T03:48:26.445Z"
}
],
"pagination": {
"total": 1,
"page": 1,
"limit": 10,
"total_pages": 1
}
}

**DELETE** - `DELETE /api/admin/shops/delete-shop/:id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"confirm_shop_name" : "Your Shop"
}

### Response

{
"message": "Shop deleted sucessfully"
}

**PUBLIC**

**GET** - `GET /api/public/shop/:slug`

### Response

{
"shop": {
"shop_name": "Your Shop"
}
}

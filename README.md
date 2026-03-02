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

<!-- ## Installation

Clone repository:

````bash
git clone https://github.com/USERNAME/REPO_NAME.git

Install dependencies:

```bash
npm install
```` -->

<!-- ---

## Environment Setup

Copy env file:

```bash
cp .env.copy .env
```

Lalu isi sesuai konfigurasi kamu.

Contoh:

```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=electric_menu
JWT_SECRET=your_secret
```

---

## Run Project

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server akan berjalan di:

```
http://localhost:3000
```

--- -->

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Shop

- `GET /api/shop/:slug/products`

### Product

- `GET /api/product/allProduct`
- `POST /api/product/create-product`

---

## Folder Structure

```
backend/
├── config/
├── controllers/
├── middleware/
├── routes/
├── utils/
├── qr/
├── index.js
└── package.json
```

---

## Author

Ray Siagian

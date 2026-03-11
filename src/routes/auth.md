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

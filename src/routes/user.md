### Shop

**USER**

**PATCH** - `POST /api/shop/create-shop`

### Request Body

{
"name" : "Your New Name"
}

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Name successfully changed"
}

**ADMIN**

**PATCH** - `POST /api/admin/users/:id/deactivate`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"confirm_name" : "User Name"
}

### Response

{
"message": "User deactivated sucessfully"
}

**PATCH** - `POST /api/admin/users/:id/activate`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"confirm_name" : "User Name"
}

### Response

{
"message": "User activated sucessfully"
}

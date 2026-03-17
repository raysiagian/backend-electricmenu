### Type

**USER**

**GET** - `GET /api/type/search-type`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Type retrieved successfully",
"result": [
{
"type_name": "type name"
}
]
}

**ADMIN**

**POST** - `POST /api/admin/types/create-type`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"type_name": "type name"
}

### Response

{
"message": "Type created successfully"
}

**GET** - `GET /api/admin/types/:id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Type retrieved successfully",
"type": {
"type_name": "es krim"
}
}

**GET** - `GET /api/admin/types/search`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Response

{
"message": "Type retrieved successfully",
"types": [
{
"id": 1,
"type_name": "type name"
}
],
"pagination": {
"total": 1,
"page": 1,
"limit": 10,
"totalPages": 1
}
}

**PATCH** - `PATCH /api/admin/types/edit-type/:id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"type_name": "type-name"
}

### Response

{
"message": "Type name sucessfully edited",
"type_name": "type-name"
}

**DELETE** - `DELETE /api/admin/types/delete-type/:id`

### Authorization

Bearer Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE4LCJlbWFpbCI6InJheXNpYWdpYW43QGdtYWlsLmNvbSIsInJvbGVfaWQiOjIsImlhdCI6MTc3Mjc3NTYxOCwiZXhwIjoxNzcyNzc5MjE4LCJpc3MiOiJlbWVudS1hcGkifQ.YqeoXx2v4TQbEe06jzB7s4t5lrjPpbE1CyvpkYfXVlc

### Request Body

{
"confirm_type_name" : "type name"
}

### Response

{
"message": "Type deleted successfully",
"result": {
"success": true
}
}

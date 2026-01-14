# Postman Collection

This document outlines the API endpoints for the various services in the CityMarket project.

## Auth Service

### Base URL: `http://localhost:3001/api/v1/auth`

---

### Register a new user

* **Method:** POST
* **URL:** `/register`
* **Headers:**
  * `Content-Type: application/json`
* **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

---

### Login

* **Method:** POST
* **URL:** `/login`
* **Headers:**
  * `Content-Type: application/json`
* **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

---

### Refresh Token

* **Method:** POST
* **URL:** `/refresh`
* **Headers:**
  * `Content-Type: application/json`
* **Body:**
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

---

### Validate Token

* **Method:** POST
* **URL:** `/validate`
* **Headers:**
  * `Content-Type: application/json`
* **Body:**
  ```json
  {
    "token": "your-jwt-token"
  }
  ```

---

### Logout

* **Method:** POST
* **URL:** `/logout`
* **Headers:**
  * `Content-Type: application/json`
* **Body:**
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

## User Service

### Base URL: `http://localhost:3002/api/v1/users`

---

### Create a new customer

* **Method:** POST
* **URL:** `/customers`
* **Headers:**
  * `Content-Type: application/json`
* **Body:**
  ```json
  {
    "authId": "auth0|123456789",
    "email": "customer@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "123-456-7890"
  }
  ```

---

### Get my profile

* **Method:** GET
* **URL:** `/customers/me`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Update my profile

* **Method:** PATCH
* **URL:** `/customers/me`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "098-765-4321"
  }
  ```

---

### Add a new address

* **Method:** POST
* **URL:** `/customers/me/addresses`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA",
    "isPrimary": true
  }
  ```

---

### Get my addresses

* **Method:** GET
* **URL:** `/customers/me/addresses`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Delete an address

* **Method:** DELETE
* **URL:** `/addresses/:addressId`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `addressId`: The ID of the address to delete.

## Catalog Service

### Base URL: `http://localhost:3003/api/v1/catalog`

---

### Create a new category

* **Method:** POST
* **URL:** `/categories`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  }
  ```

---

### Get all categories

* **Method:** GET
* **URL:** `/categories`

---

### Get category by ID

* **Method:** GET
* **URL:** `/categories/:id`
* **Path Variables:**
  * `id`: The ID of the category.

---

### Update a category

* **Method:** PATCH
* **URL:** `/categories/:id`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the category to update.
* **Body:**
  ```json
  {
    "name": "Digital Electronics",
    "description": "Digital electronic devices and accessories"
  }
  ```

---

### Delete a category

* **Method:** DELETE
* **URL:** `/categories/:id`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the category to delete.

---

### Create a new product

* **Method:** POST
* **URL:** `/products`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "name": "Laptop",
    "description": "A powerful laptop",
    "price": 1200,
    "categoryId": "category-id",
    "vendorId": "vendor-id",
    "stock": 100
  }
  ```

---

### Search for products

* **Method:** GET
* **URL:** `/products/search?q=<query>`
* **Query Parameters:**
  * `q`: The search query.

---

### Get products by vendor

* **Method:** GET
* **URL:** `/products/vendor/:vendorId`
* **Path Variables:**
  * `vendorId`: The ID of the vendor.

---

### Get products by category

* **Method:** GET
* **URL:** `/products/category/:categoryId`
* **Path Variables:**
  * `categoryId`: The ID of the category.

---

### Get product by ID

* **Method:** GET
* **URL:** `/products/:id`
* **Path Variables:**
  * `id`: The ID of the product.

---

### Update a product

* **Method:** PATCH
* **URL:** `/products/:id`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the product to update.
* **Body:**
  ```json
  {
    "name": "Gaming Laptop",
    "price": 1500
  }
  ```

---

### Update product stock

* **Method:** PATCH
* **URL:** `/products/:id/stock`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the product to update.
* **Body:**
  ```json
  {
    "stock": 50
  }
  ```

---

### Delete a product

* **Method:** DELETE
* **URL:** `/products/:id`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the product to delete.

## Order Service

### Base URL: `http://localhost:3004/api/v1/orders`

---

### Create a new order

* **Method:** POST
* **URL:** `/orders`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "customerId": "customer-id",
    "vendorId": "vendor-id",
    "items": [
      {
        "productId": "product-id",
        "quantity": 2,
        "price": 1200
      }
    ]
  }
  ```

---

### Get my orders

* **Method:** GET
* **URL:** `/orders/customer/me`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Get vendor orders

* **Method:** GET
* **URL:** `/orders/vendor/:vendorId`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `vendorId`: The ID of the vendor.

---

### Get all orders

* **Method:** GET
* **URL:** `/orders`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Get order by ID

* **Method:** GET
* **URL:** `/orders/:id`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the order.

---

### Update order status

* **Method:** PATCH
* **URL:** `/orders/:id/status`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the order to update.
* **Body:**
  ```json
  {
    "status": "shipped"
  }
  ```

---

### Cancel an order

* **Method:** POST
* **URL:** `/orders/:id/cancel`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the order to cancel.

## Delivery Service

### Base URL: `http://localhost:3005/api/v1/deliveries`

---

### Register a new courier

* **Method:** POST
* **URL:** `/couriers`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "authId": "auth0|abcdef123",
    "name": "Speedy Gonzales",
    "phone": "555-123-4567",
    "vehicle": "Motorcycle"
  }
  ```

---

### Get my courier profile

* **Method:** GET
* **URL:** `/couriers/me`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Get available couriers

* **Method:** GET
* **URL:** `/couriers/available`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Update courier profile

* **Method:** PATCH
* **URL:** `/couriers/:id`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the courier to update.
* **Body:**
  ```json
  {
    "phone": "555-765-4321",
    "vehicle": "Van"
  }
  ```

---

### Update courier availability

* **Method:** PATCH
* **URL:** `/couriers/:id/availability`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the courier to update.
* **Body:**
  ```json
  {
    "available": false
  }
  ```

---

### Create a new delivery

* **Method:** POST
* **URL:** `/deliveries`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "orderId": "order-id",
    "customerId": "customer-id",
    "vendorId": "vendor-id",
    "pickupAddress": "123 Vendor St, Anytown, USA",
    "deliveryAddress": "456 Customer Ave, Anytown, USA"
  }
  ```

---

### Get pending deliveries

* **Method:** GET
* **URL:** `/deliveries/pending`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Get my courier deliveries

* **Method:** GET
* **URL:** `/deliveries/my`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Get delivery by ID

* **Method:** GET
* **URL:** `/deliveries/:id`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the delivery.

---

### Assign a courier to a delivery

* **Method:** POST
* **URL:** `/deliveries/:id/assign`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the delivery.
* **Body:**
  ```json
  {
    "courierId": "courier-id"
  }
  ```

---

### Update delivery status

* **Method:** PATCH
* **URL:** `/deliveries/:id/status`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the delivery to update.
* **Body:**
  ```json
  {
    "status": "in_transit"
  }
  ```

## Vendor Service

### Base URL: `http://localhost:3006/api/v1/vendors`

---

### Create a new vendor

* **Method:** POST
* **URL:** `/vendors`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Body:**
  ```json
  {
    "authId": "auth0|vendor123",
    "name": "The Corner Store",
    "description": "Your friendly neighborhood store",
    "address": "123 Corner St, Anytown, USA",
    "phone": "555-111-2222"
  }
  ```

---

### Get my vendor profile

* **Method:** GET
* **URL:** `/vendors/me`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`

---

### Get open vendors

* **Method:** GET
* **URL:** `/vendors/open`

---

### Get all vendors

* **Method:** GET
* **URL:** `/vendors`

---

### Get vendor by ID

* **Method:** GET
* **URL:** `/vendors/:id`
* **Path Variables:**
  * `id`: The ID of the vendor.

---

### Update a vendor

* **Method:** PATCH
* **URL:** `/vendors/:id`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the vendor to update.
* **Body:**
  ```json
  {
    "name": "The Awesome Corner Store",
    "description": "Your most awesome friendly neighborhood store"
  }
  ```

---

### Update vendor status

* **Method:** PATCH
* **URL:** `/vendors/:id/status`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the vendor to update.
* **Body:**
  ```json
  {
    "status": "closed"
  }
  ```

---

### Set working hours for a vendor

* **Method:** POST
* **URL:** `/vendors/:id/working-hours`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the vendor.
* **Body:**
  ```json
  [
    {
      "dayOfWeek": 1,
      "openTime": "09:00",
      "closeTime": "17:00"
    },
    {
      "dayOfWeek": 2,
      "openTime": "09:00",
      "closeTime": "17:00"
    }
  ]
  ```

---

### Get working hours for a vendor

* **Method:** GET
* **URL:** `/vendors/:id/working-hours`
* **Headers:**
  * `Authorization: Bearer <your_jwt_token>`
* **Path Variables:**
  * `id`: The ID of the vendor.
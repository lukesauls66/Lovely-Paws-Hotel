# `Lovely Paws Hotel`

## Database Schema Design

`<insert db schema design here>`

## API Documentation

## STAFF / CLIENT AUTHENTICATION OR AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current staff/client to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - content-Type: application/json
  - Body:

  ```json
  {
    "message": "Authentication required"
  }
  ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current staff / client does not have the correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "message": "Forbidden"
  }
  ```

### Get the Current User

Returns the information about the current Staff or Client that is logged in.

- Require Authentication: false
- Request:

  - Method: GET
  - Route path: (/api/session)
  - Body: none

- Successful Response when there is a logged in Staff

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "user": {
      "id": 1,
      "fname": "John",
      "lname": "Smith",
      "username": "johnsmith",
      "password": "password1",
      "address": "123 main st",
      "city": "redlands",
      "state": "CA",
      "zip": 92323,
      "staff": true,
      "position": "manager"
    }
  }
  ```

- Successful Response when there is a logged in Client

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "user": {
      "id": 1,
      "fname": "John",
      "lname": "Smith",
      "username": "johnsmith",
      "password": "password1",
      "address": "123 main st",
      "city": "redlands",
      "state": "CA",
      "zip": 92323,
      "staff": false,
      "position": null
    }
  }
  ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/session/login
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "fname": "John",
        "lname": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "staff": true // for client will be false
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new Client, logs them in as the current Client, and returns the current
Client's information.

- Require Authentication: false
- Request

  - Method: POST
  - Route path: /api/user/signup
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "fname": "John",
      "lname": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password",
      "address": "123 main st",
      "city": "redlands",
      "state": "CA",
      "zip": 92323
    }
    ```

     <!-- "staff": false,
      "position": null -->

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "fname": "John",
        "lname": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith",
        "address": "123 main st",
        "city": "redlands",
        "state": "CA",
        "zip": 92323,
        "staff": true,
        "position": "manager"
      }
    }
    ```

- Error response: Staff already exists with the specified email or username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "fname": "First Name is required",
        "lname": "Last Name is required",
        "address": "Address is required",
        "city": "City is required",
        "state": "State is required",
        "zip": "Zip code is required"
      }
    }
    ```

## PETS

### Get all Pets

Return all the pets.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/pets
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Pets": [
            {
                "id": 1,
                "ownerId": 1,
                "type": "dog",
                "breed": "German Shepard",
                "name": "Ricky",
                "gender": "male",
                "dob": 06-01-2023,
                "size": "Oh lawd he coming",
                "weight": 90,
                "behavior": "calm",
                "medicationNote": "Needs sleep medicine because crazy",
                "dietaryNote": "Cannot eat rocks",
                "previewImage": "image url"
            }
        ]
    }

    ```

### Get all Pets owned by Current User

Return all pets owned by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/pets/:userId
  - Body: None

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Pets": [
            {
                "id": 1,
                "ownerId": 1,
                "type": "dog",
                "breed": "German Shepard",
                "name": "Ricky",
                "gender": "male",
                "dob": 06-01-2023,
                "size": "Oh lawd he coming",
                "weight": 90,
                "behavior": "calm",
                "medicationNote": "Needs sleep medicine because crazy",
                "dietaryNote": "Cannot eat rocks",
                "previewImage": "image url"
            }
        ]
    }
    ```

### Get details of a Pet from an id

Returns the details of a pet by its id

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/pets/:petId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "id": 1,
        "ownerId": 1,
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "PetImages": [
            {
                "id": 1,
                "url": "image url",
            },
            {
                "id": 2,
                "url": "image url",
            }
        ],
        "Owner": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
        }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
  - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

### Create a Pet

Creates and returns a new Pet

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /api/pets
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "id": 1,
        "ownerId": 1,
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url",
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "type": "Type is required",
        "breed": "Breed is required",
        "name": "Name is required",
        "gender": "Gender is required",
        "dob": "DOB is required",
        "size": "Size is required",
        "weight": "Weight is required",
        "behavior": "Behavior is required",
        "medicationNote": "MedicationNote is required",
        "dietaryNote": "DietaryNote is required",
        "previewImage": "Preview image is required"
      }
    }
    ```

### Add an Image to a Pet based on the Pet's id

Create and return a new image for a pet specified by id.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user, or staff member
- Request

  - Method: POST
  - Route path: /api/pets/:petId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "petId": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

### Edit a Pet

Updates and returns an existing Pet.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user, or staff member
- Request

  - Method: Put
  - Route path: /api/pets/:petId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "id": 1,
        "ownerId": 1,
        "type": "dog",
        "breed": "German Shepard",
        "name": "Ricky",
        "gender": "male",
        "dob": 06-01-2023,
        "size": "Oh lawd he coming",
        "weight": 90,
        "behavior": "calm",
        "medicationNote": "Needs sleep medicine because crazy",
        "dietaryNote": "Cannot eat rocks",
        "previewImage": "image url",
        "createdAt": "2021-11-19 20:39:36",
        "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "type": "Type is required",
        "breed": "Breed is required",
        "name": "Name is required",
        "gender": "Gender is required",
        "dob": "DOB is required",
        "size": "Size is required",
        "weight": "Weight is required",
        "behavior": "Behavior is required",
        "medicationNote": "MedicationNote is required",
        "dietaryNote": "DietaryNote is required",
        "previewImage": "Preview image is required"
      }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

### Delete a Pet

Deletes an existing Pet.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user, or staff member
- Request

  - Method: DELETE
  - Route path: /api/pets/:petId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

## SERVICE

### Get all Services

Returns all the services.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/services
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Services": [
        {
          "typeOfServices": "hair-trim",
          "staff": [1, 3, 5, 8, 13],
          "price": 80
        },
        {
          "typeOfServices": "nail-trim",
          "staff": [2, 4, 6, 9, 14],
          "price": 40
        },
        {
          "typeOfServices": "bath",
          "staff": [1, 3, 4, 5, 7, 8, 13],
          "price": 60
        }
      ]
    }
    ```

### Get a Service based on id

Returns a service based on id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /api/services/:serviceId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "typeOfServices": "hair-trim",
      "staff": [1, 3, 5, 8, 13],
      "price": 80
    }
    ```

### Create a Service

Creates and returns a new service,

- Require Authentication: Staff only
- Request

  - Method: Post
  - Route path: /api/services
  - Body:

  ```json
  {
    "staffId": 1,
    "typeOfService": "neuterings",
    "price": 100
  }
  ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "typeOfService": "neuterings",
    "price": 100
  }
  ```

- Error Response: Body validation errors

- Status Code: 400
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Bad Request",
    "errors": {
      "typeOfService": "TypeOfService is required",
      "price": "Price must be a positive integer"
    }
  }
  ```

### Edit a Service

Updates and returns an existing service.

- Require Authentication: true
- Require proper authorization: Staff must be signed in to edit
- Request

  - Method: Put
  - Route path: /api/services/:serviceId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "typeOfServices": "hair-trim",
      "staff": [1, 3, 5, 8, 13],
      "price": 60
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "typeOfServices": "hair-trim",
      "staff": [1, 3, 5, 8, 13],
      "price": 60
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "typeOfServices": "TypeOfServices is required",
        "staff": "Staff must list all staff members by id who can do this service",
        "price": "Price must be a positive number"
      }
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

### Delete a Service

Deletes an existing service.

- Require Authentication: true
- Require proper authorization: Staff must be signed in
- Request

  - Method: DELETE
  - Route path: /api/services/:serviceId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

## Reviews

### Get all Reviews by current user

Returns all the reviews written by the current user.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /api/session/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "serviceId": 1,
          "review": "This was an awesome service!",
          "paws": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "Service": {
            "typeOfServices": "hair-trim",
            "staff": [1, 3, 5, 8, 13],
            "price": 60
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ]
        }
      ]
    }
    ```

### Get all reviews by Service Id

Returns all the reviews that belong to a service specified by id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /services/:serviceId/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "serviceId": 1,
          "review": "This was an awesome service!",
          "paws": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ]
        }
      ]
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

### Get all reviews by Booking Id

Returns all the reviews that belong to a booking specified by id.

- Require Authentication: false
- Request

  - Method: GET
  - Route path: /bookings/:bookingId/reviews
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Reviews": [
        {
          "id": 1,
          "userId": 1,
          "bookingId": 1,
          "review": "This was an awesome booking!",
          "paws": 5,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "ReviewImages": [
            {
              "id": 1,
              "url": "image url"
            }
          ]
        }
      ]
    }
    ```

- Error response: Couldn't find a Booking with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

### Create a review based on service id

Create and return a new review for a service specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /reviews/:serviceId/
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review": "This was an awesome service!",
      "paws": 5
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome service!",
      "paws": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "paws": "Paws must be an integer from 1 to 5"
      }
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

- Error response: Review from the current user already exists for the Service

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already has a review for this service"
    }
    ```

### Create a review based on booking id

Create and return a new review for a booking specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - Route path: /reviews/:bookingId/
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "review": "This was an awesome booking!",
      "paws": 5
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "spotId": 1,
      "review": "This was an awesome booking!",
      "paws": 5,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "paws": "Paws must be an integer from 1 to 5"
      }
    }
    ```

- Error response: Couldn't find a Booking with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

- Error response: Review from the current user already exists for the Booking

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already has a review for this booking"
    }
    ```

### Edit a Review

Update and return an existing review.

- Require Authentication: true
- Require proper authorization: Review must belong to the current user
- Request

- Method: PUT
- Route path: /reviews/:reviewId
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "review": "This was an awesome service!",
    "paws": 5
  }
  ```

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "id": 1,
    "userId": 1,
    "serviceId": 1,
    "review": "This was an awesome service!",
    "paws": 5,
    "createdAt": "2021-11-19 20:39:36",
    "updatedAt": "2021-11-20 10:06:40"
  }
  ```

- Error Response: Body validation errors

- Status Code: 400
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Bad Request",
    "errors": {
      "review": "Review text is required",
      "paws": "Paws must be an integer from 1 to 5"
    }
  }
  ```

- Error response: Couldn't find a Review with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Review couldn't be found"
  }
  ```

### Delete a Review

Delete an existing review.

- Require Authentication: true
- Require proper authorization: Current user must be the owner of the review or a staff member
- Request

- Method: DELETE
- Route path: /reviews/:reviewId
- Body: none

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Successfully deleted"
  }
  ```

- Error response: Couldn't find a Review with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Review couldn't be found"
  }
  ```

## Bookings

### Get all bookings for today - by Staff

- Require authentication: True for Staff
- Request:

  - Method: GET
  - Route path: /api/bookings/<today's date>
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "Today's Bookings": [
      {
        "Pet Information": {
          "id": 1,
          "ownerId": 2,
          "type": "dog",    // <!-- cat or dog -->
          "name": "King",
          "breed": "husky",
          "gender": "male",
          "dob": "2021-12-10",
          "size": "medium",
          "weight": 45,     // in lbs
          "behavior": "friendly",
          "medicationNotes": "please give the medication once a day",
          "dietaryNotes": "none",
          "previewImage": "https://sample.image.png",
          "petImages": [
            {
              "id": 1,
              "petId": 1,
              "url": "https://sample.image1.png"
            }
                        {
              "id": 2,
              "petId": 1,
              "url": "https://sample.image2.png"
            }
          ]
        }
      }
      {
        "Services": {
          "id": 1,
          "typeOfService": "hair-trim",    // Day-Care or Boarding-Care
          "price": 75.00,             // calculated on the last day of boarding or on the day-care
          "serviceImages": [
            {
              "id": 1,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
                        {
              "id": 2,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
          ],
          "Staff":[
            {
            "id": 5,
            "fname": "John",
            "lname": "Smith"
            },
            {
            "id": 8,
            "fname": "Jane",
            "lname": "Smith"
            },
            {
            "id": 11,
            "fname": "Widdow",
            "lname": "Smith"
            },
          ],
          "dropOffDatetime": "2024-12-10 08:00:00",
          "pickUpDateTime": "2021-12-10 18:00:00",
        }
      }
    ]
  }
  ```

  <!--

### Get all Bookings based on service id

Return all bookings based on id

- Require Authentication: Staff only
- Request

  - Method: GET
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    ["TBD"]
    ```

- Error response: No bookings with this service id today

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ````json
    {
      "message": "No bookings with this service"
    }
    ``` -->
    ````

### Create a Booking based on a Pets id

Create and return a new booking for a pet based on their id.

- Require Authentication: true
- Require proper authorization: current user must be the owner of the pet or a staff member
- Request

  - Method: POST
  - Route path: /bookings/:petId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "bookingType": "Day Care",
      "services": [1], //box with check boxes of which services to select
      "dropOffDatetime": "2024-12-10 08:00:00",
      "pickUpDateTime": "2021-12-10 18:00:00"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Client Information": {
          "id": 1,
          "fname": "John",
          "lname": "Smith",
          "email": "john.smith@gmail.com",
          "username": "JohnSmith",
          "address": "123 main st",
          "city": "redlands",
          "state": "CA",
          "zip": 92323,
          "staff": false,
          "position": null
        },
        "Pet Information": {
          "id": 1,
          "ownerId": 2,
          "type": "dog",    // <!-- cat or dog -->
          "name": "King",
          "breed": "husky",
          "gender": "male",
          "dob": "2021-12-10",
          "size": "medium",
          "weight": 45,     // in lbs
          "behavior": "friendly",
          "medicationNotes": "please give the medication once a day",
          "dietaryNotes": "none",
          "previewImage": "https://sample.image.png",
          "petImages": [
            {
              "id": 1,
              "petId": 1,
              "url": "https://sample.image1.png"
            }
                        {
              "id": 2,
              "petId": 1,
              "url": "https://sample.image2.png"
            }
          ]
        }
      }
      {
        "Services": {
          "id": 1,
          "typeOfService": "hair-trim",    // Day-Care or Boarding-Care
          "price": 75.00,             // calculated on the last day of boarding or on the day-care
          "serviceImages": [
            {
              "id": 1,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
                        {
              "id": 2,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
          ],
          "Staff":[
            {
            "id": 5,
            "fname": "John",
            "lname": "Smith"
            },
            {
            "id": 8,
            "fname": "Jane",
            "lname": "Smith"
            },
            {
            "id": 11,
            "fname": "Widdow",
            "lname": "Smith"
            },
          ],
        },
        "bookingType": "Dary care",
        "dropOffDatetime": "2024-12-10 08:00:00",
        "pickUpDateTime": "2021-12-10 18:00:00",
        "price": 175
      }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", //these are the only errors we can have since we'll have selectors for them to choose from
      "errors": {
        "dropOffDatetime": "dropOffDatetime cannot be in the past",
        "pickUpDateTime": "pickUpDateTime cannot be on or before dropOffDatetime"
      }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

- Error response: Booking conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this Pet is already booked for the specified dates",
      "errors": {
        "dropOffDatetime": "Start date conflicts with an existing booking",
        "pickUpDateTime": "End date conflicts with an existing booking"
      }
    }
    ```

### Edit a Booking

Update and return an existing booking.

- Require Authentication: true
- Require proper authorization: Booking must belong to the current user
- Request

  - Method: PUT
  - Route path: /bookings/:bookingId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "bookingType": "Day Care",
      "services": [1], //box with check boxes of which services to select
      "dropOffDatetime": "2024-12-10 08:00:00",
      "pickUpDateTime": "2021-12-10 18:00:00"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
        "Client Information": {
          "id": 1,
          "fname": "John",
          "lname": "Smith",
          "email": "john.smith@gmail.com",
          "username": "JohnSmith",
          "address": "123 main st",
          "city": "redlands",
          "state": "CA",
          "zip": 92323,
          "staff": false,
          "position": null
        },
        "Pet Information": {
          "id": 1,
          "ownerId": 2,
          "type": "dog",    // <!-- cat or dog -->
          "name": "King",
          "breed": "husky",
          "gender": "male",
          "dob": "2021-12-10",
          "size": "medium",
          "weight": 45,     // in lbs
          "behavior": "friendly",
          "medicationNotes": "please give the medication once a day",
          "dietaryNotes": "none",
          "previewImage": "https://sample.image.png",
          "petImages": [
            {
              "id": 1,
              "petId": 1,
              "url": "https://sample.image1.png"
            }
                        {
              "id": 2,
              "petId": 1,
              "url": "https://sample.image2.png"
            }
          ]
        }
      }
      {
        "Services": {
          "id": 1,
          "typeOfService": "hair-trim",    // Day-Care or Boarding-Care
          "price": 75.00,             // calculated on the last day of boarding or on the day-care
          "serviceImages": [
            {
              "id": 1,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
                        {
              "id": 2,
              "serviceId": 1,
              "url": "https://sample/image10.png"
            }
          ],
          "Staff":[
            {
            "id": 5,
            "fname": "John",
            "lname": "Smith"
            },
            {
            "id": 8,
            "fname": "Jane",
            "lname": "Smith"
            },
            {
            "id": 11,
            "fname": "Widdow",
            "lname": "Smith"
            },
          ],
        },
        "bookingType": "Dary care",
        "dropOffDatetime": "2024-12-10 08:00:00",
        "pickUpDateTime": "2021-12-10 18:00:00",
        "price": 175
      }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", //these are the only errors we can have since we'll have selectors for them to choose from
      "errors": {
        "dropOffDatetime": "dropOffDatetime cannot be in the past",
        "pickUpDateTime": "pickUpDateTime cannot be on or before dropOffDatetime"
      }
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

- Error response: Can't edit a booking that's past the end date

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Past bookings can't be modified"
    }
    ```

- Error response: Booking conflict

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Sorry, this pet is already booked for the specified dates",
      "errors": {
        "dropOffDatetime": "Start date conflicts with an existing booking",
        "pickUpDateTime": "End date conflicts with an existing booking"
      }
    }
    ```

### Delete a Booking

Delete an existing booking.

- Require Authentication: true
- Require proper authorization: Current user must be the one who booked or must be a staff member
- Request

  - Method: DELETE
  - Route path: /bookings/:bookingId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Booking with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Booking couldn't be found"
    }
    ```

- Error response: Bookings that have been started can't be deleted

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bookings that have been started can't be deleted"
    }
    ```

### Get all of the Current User's Bookings

Return all the bookings that the current user has made.

- Require Authentication: true
- Request

  - Method: GET
  - Route path: /session/bookings
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Bookings": [
        {
          "id": 1,
          "Services": [
            {
              "typeOfServices": "hair-trim",
              "staff": [1, 3, 5, 8, 13],
              "price": 80
            },
            {
              "typeOfServices": "nail-trim",
              "staff": [2, 4, 6, 9, 12],
              "price": 50
            }
          ],
          "clientId": 2,
          "petId": 4,
          "dropOffDatetime": "2024-12-10 08:00:00",
          "pickUpDateTime": "2021-12-10 18:00:00"
        }
      ]
    }
    ```

## IMAGES

### Add a pet image

Add an image to a pet

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user
- Request

- Method: Post
- Route path: /pets/:petId/images/
- Body:

  ```json
  {
    "url": "image url"
  }
  ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Pet with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Pet couldn't be found"
    }
    ```

- Error response: Cannot add any more images because there is a maximum of 5
  images per resource

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Maximum number of images for this resource was reached"
    }
    ```

### Delete a Pet Image

Delete an existing image for a Pet.

- Require Authentication: true
- Require proper authorization: Pet must belong to the current user
- Request

- Method: DELETE
- Route path: /pets/:petId/images/:imageId
- Body: none

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Successfully deleted"
  }
  ```

- Error response: Couldn't find a Pet Image with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Pet Image couldn't be found"
  }
  ```

### Add a Service image

Add an image to a Service

- Require Authentication: true
- Require proper authorization: Service must belong to the current user
- Request

- Method: Post
- Route path: /services/:serviceId/images/
- Body:

  ```json
  {
    "url": "image url"
  }
  ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url"
    }
    ```

- Error response: Couldn't find a Service with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Service couldn't be found"
    }
    ```

- Error response: Cannot add any more images because there is a maximum of 5
  images per resource

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Maximum number of images for this resource was reached"
    }
    ```

### Delete a Service Image

Delete an existing image for a Service.

- Require Authentication: true
- Require proper authorization: Service must belong to the current user
- Request

- Method: DELETE
- Route path: /services/:serviceId/images/:imageId
- Body: none

- Successful Response

- Status Code: 200
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Successfully deleted"
  }
  ```

- Error response: Couldn't find a Service Image with the specified id

- Status Code: 404
- Headers:
  - Content-Type: application/json
- Body:

  ```json
  {
    "message": "Service Image couldn't be found"
  }
  ```

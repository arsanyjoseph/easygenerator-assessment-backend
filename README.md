# EasyGenerator Assessment

This is a NestJS application developed as an assessment for EasyGenerator.

## Description

This project is built with NestJS, a progressive Node.js framework for building efficient and scalable server-side applications. It utilizes MongoDB for data persistence through Mongoose, and includes JWT authentication.

## Requirements

- Node.js
- MongoDB
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd easygenerator-assessment

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/easygenerator

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

# App
PORT=3000
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation

This project uses Swagger for API documentation. After starting the application, you can access the Swagger UI at:

```
http://localhost:3000/api
```

## Features

- NestJS framework
- MongoDB integration with Mongoose
- JWT authentication
- API documentation with Swagger
- Unit and E2E testing with Jest

## Development

- Run `npm run lint` to check and fix linting issues
- Run `npm run format` to format the code using Prettier

## License

This project is [UNLICENSED](LICENSE).
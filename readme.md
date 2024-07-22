# TypeScript Backend Setup

## Overview

This project is a TypeScript-based backend setup designed for building RESTful APIs. It leverages modern development tools and practices to ensure a robust, maintainable, and scalable codebase. The setup includes essential features such as database migrations, environment configuration, linting, formatting, and testing.

## Features

- **TypeScript**: Strongly typed language that builds on JavaScript, providing better tooling at any scale.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Database Migrations**: Manage database schema changes with ease using `db-migrate`.
- **Environment Configuration**: Manage environment variables using `dotenv`.
- **Linting and Formatting**: Ensure code quality and consistency with ESLint and Prettier.
- **Testing**: Comprehensive testing setup with Mocha, Chai, and NYC for coverage.
- **OAuth Integration**: Built-in support for OAuth authentication with Google and Facebook.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)
- PostgreSQL (>= 12.x)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/typescriptbackendsetup.git
   cd typescriptbackendsetup
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your environment variables. Refer to `.env.example` for the required variables.

4. Run database migrations:
   ```sh
   npm run migrate:up
   ```

### Development

To start the development server with hot-reloading:
```sh
npm run dev
```

### Building for Production

To build the project for production:
```sh
npm run build
```

### Running Tests

To run the tests:
```sh
npm test
```

## Project Structure

```plaintext
.
├── dist/                       # Compiled output
├── src/                        # Source files
│   ├── config/                 # Configuration files
│   ├── modules/                # Feature modules
│   ├── routes/                 # API routes
│   ├── utils/                  # Utility functions
│   └── index.ts                # Entry point
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── package.json                # NPM scripts and dependencies
├── tsconfig.json               # TypeScript configuration
└── webpack.config.js           # Webpack configuration
```

## Scripts

- `npm run dev`: Start the development server with hot-reloading.
- `npm run build`: Build the project for production.
- `npm run migrate`: Run database migrations.
- `npm run seed`: Run database seeders.
- `npm run lint`: Lint the codebase using ESLint.
- `npm run format`: Format the codebase using Prettier.
- `npm test`: Run tests with Mocha and generate coverage reports.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [db-migrate](https://db-migrate.readthedocs.io/)
- [dotenv](https://github.com/motdotla/dotenv)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [NYC](https://github.com/istanbuljs/nyc)

## Contact

Author: Jason Kwame Appiatu
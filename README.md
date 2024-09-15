# NoteSphere - A Full-Stack Notes App using MERN

NoteSphere is a full-featured, secure, and intuitive notes-taking application built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to create, edit, delete, and manage their notes effortlessly, with support for user authentication and secure data handling.

## Project Overview

- **Frontend**: Built using React.js for a responsive and interactive user interface.
- **Backend**: Developed using Node.js and Express.js to handle APIs and server-side logic.
- **Database**: MongoDB is used as the NoSQL database for storing user data and notes securely.
- **Authentication**: User authentication is implemented using JWT (JSON Web Token) for secure login and registration.

## Features

- **User Authentication**: Secure user login and registration with JWT authentication.
- **Create, Edit, and Delete Notes**: Users can manage their notes with ease.
- **Real-time Synchronization**: Automatically updates the notes in the database in real-time.
- **Responsive UI**: A user-friendly and responsive interface built using React.js.
- **Data Validation**: Input data validation on both the frontend and backend to ensure proper user input.

## Tech Stack

### Frontend
- **React.js**: JavaScript library for building user interfaces.
- **Axios**: HTTP client for making API requests.
- **Bootstrap**: CSS framework for responsive design.

### Backend
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Node.js framework for building APIs.
- **MongoDB**: NoSQL database for storing user and note data.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **JWT**: JSON Web Token for user authentication.

## Installation and Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/DipeshK47/NoteSphere---a-Full-Stack-Notes-App-using-MERN.git
    ```

2. **Install dependencies for both frontend and backend**:

    Navigate to the root directory of the project and run the following commands:
    
    - Install backend dependencies:
      ```bash
      cd backend
      npm install
      ```

    - Install frontend dependencies:
      ```bash
      cd frontend
      npm install
      ```

3. **Set up the environment variables**:

   In the `backend` directory, create a `.env` file and add the following variables:
   
   ```bash
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   PORT=5000
   ```

4. **Run the application**:

    - Start the backend server:
      ```bash
      cd backend
      npm start
      ```

    - Start the frontend development server:
      ```bash
      cd frontend
      npm start
      ```

    The frontend will be available at `http://localhost:3000`, and the backend will run on `http://localhost:5000`.

## Usage

1. Register or login as a user.
2. Once authenticated, you can create, edit, and delete notes in your account.
3. Notes are stored securely in the MongoDB database and can be accessed anytime by logging into your account.

## Folder Structure

### Backend
- **models/**: Contains the Mongoose models for users and notes.
- **routes/**: Express.js routes for handling user authentication and note management.
- **controllers/**: Contains the business logic for user and note operations.

### Frontend
- **src/components/**: React components for rendering the UI.
- **src/services/**: Axios service for API calls.
- **src/pages/**: Pages for the app such as login, signup, and dashboard.


## Contributing

If you'd like to contribute to this project, feel free to submit a pull request. Please make sure to open an issue first to discuss your proposed changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)

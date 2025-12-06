# 🎨 c0lornote

**A Social Hub for People Made by the People**

c0lornote is a vibrant, colorful social networking platform where users can share their thoughts through customizable colorful notes, connect with others, and build a community around creative expression.

## ✨ Features

- **🎨 Colorful Notes**: Create and share notes with customizable colors and backgrounds
- **👥 Social Connections**: Follow other users and build your network
- **💬 Engagement**: Like and comment on notes from the community
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔐 Secure Authentication**: JWT-based authentication for user security
- **🌐 Public & Private Feeds**: View your personalized feed or discover public content

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Docker (optional, for containerized deployment)

### Quick Start with Script

```bash
git clone https://github.com/rollandinho/c0lornote.git
cd c0lornote
chmod +x setup.sh
./setup.sh
```

Then follow the on-screen instructions.

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rollandinho/c0lornote.git
   cd c0lornote
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run the application**

   In one terminal, start the backend server:
   ```bash
   npm run dev
   ```

   In another terminal, start the frontend:
   ```bash
   cd client
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### 🐳 Docker Deployment

The easiest way to run c0lornote is with Docker:

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Access the application at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### 🧪 Testing the API

After starting the server, you can test the API:

```bash
node test-api.js
```

This will run automated tests on the main API endpoints.

## 📖 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: { username, email, password, displayName }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
```

### User Endpoints

#### Get Current User
```
GET /api/users/me
Headers: { Authorization: Bearer <token> }
```

#### Get User by Username
```
GET /api/users/:username
```

#### Update Profile
```
PUT /api/users/me
Headers: { Authorization: Bearer <token> }
Body: { displayName, bio, avatar }
```

#### Follow User
```
POST /api/users/:userId/follow
Headers: { Authorization: Bearer <token> }
```

#### Unfollow User
```
DELETE /api/users/:userId/follow
Headers: { Authorization: Bearer <token> }
```

### Note Endpoints

#### Create Note
```
POST /api/notes
Headers: { Authorization: Bearer <token> }
Body: { content, color, backgroundColor, tags, isPublic }
```

#### Get Feed
```
GET /api/notes/feed
Headers: { Authorization: Bearer <token> }
```

#### Get Public Notes
```
GET /api/notes/public
```

#### Get User Notes
```
GET /api/notes/user/:username
```

#### Get Single Note
```
GET /api/notes/:id
```

#### Update Note
```
PUT /api/notes/:id
Headers: { Authorization: Bearer <token> }
Body: { content, color, backgroundColor, tags, isPublic }
```

#### Delete Note
```
DELETE /api/notes/:id
Headers: { Authorization: Bearer <token> }
```

#### Like Note
```
POST /api/notes/:id/like
Headers: { Authorization: Bearer <token> }
```

#### Unlike Note
```
DELETE /api/notes/:id/like
Headers: { Authorization: Bearer <token> }
```

#### Add Comment
```
POST /api/notes/:id/comments
Headers: { Authorization: Bearer <token> }
Body: { text }
```

#### Delete Comment
```
DELETE /api/notes/:noteId/comments/:commentId
Headers: { Authorization: Bearer <token> }
```

## 🏗️ Project Structure

```
c0lornote/
├── server/
│   ├── config/
│   │   └── database.js       # Database connection
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Note.js           # Note model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User routes
│   │   └── notes.js          # Note routes
│   └── middleware/
│       └── auth.js           # Authentication middleware
├── client/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── main.jsx          # React entry point
│   │   └── styles/
│   │       └── App.css       # Application styles
│   ├── index.html            # HTML template
│   └── vite.config.js        # Vite configuration
├── server.js                 # Express server
├── package.json              # Backend dependencies
└── README.md                 # This file
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **CSS3** - Styling

## 🤝 Contributing

Contributions are welcome! This is a social hub made by the people, for the people.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🌟 Acknowledgments

- Built with ❤️ for the community
- Inspired by the need for creative self-expression
- Made possible by open-source technologies

---

**Welcome to a new way of interacting with your people!** 🎨✨

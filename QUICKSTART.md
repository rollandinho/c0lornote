# 🚀 Quick Start Guide

Get c0lornote running in 5 minutes!

## Method 1: Automated Setup (Recommended)

```bash
git clone https://github.com/rollandinho/c0lornote.git
cd c0lornote
chmod +x setup.sh
./setup.sh
```

Then:
1. Update `.env` with your MongoDB URI
2. Start MongoDB: `mongod` (if local)
3. Seed sample data: `npm run seed`
4. Start backend: `npm run dev`
5. Start frontend (new terminal): `cd client && npm run dev`
6. Visit http://localhost:3000

## Method 2: Docker (Easiest)

```bash
git clone https://github.com/rollandinho/c0lornote.git
cd c0lornote
docker-compose up
```

Visit http://localhost:3000

## Method 3: Manual Setup

### Backend Setup
```bash
npm install
cp .env.example .env
# Edit .env with your settings
npm run seed  # Optional: add sample data
npm run dev
```

### Frontend Setup (new terminal)
```bash
cd client
npm install
npm run dev
```

## First Time User?

### Register a New Account
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in your details
4. Start creating colorful notes!

### Use Sample Data
If you ran `npm run seed`, login with:
- **Username**: alice, bob, or charlie
- **Password**: password123

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check your `.env` file has the correct `MONGODB_URI`

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (3000): Change port in `client/vite.config.js`

### Dependencies Not Installing
- Update Node.js to v14 or higher
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

## What's Next?

1. **Create Your First Note**: Click "Create a New Note" and express yourself!
2. **Follow Users**: Browse public notes and follow interesting people
3. **Customize**: Try different colors for your notes
4. **Engage**: Like and comment on notes from the community

## Need Help?

- 📖 Check the full [README](README.md)
- 🤝 See [CONTRIBUTING](CONTRIBUTING.md) for development info
- 🐛 Report issues on GitHub
- 💡 Join the community and ask questions

Happy noting! 🎨

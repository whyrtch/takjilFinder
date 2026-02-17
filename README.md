# 🕌 TakjilFinder

A community-driven web application to help people find mosques offering takjil (iftar meals) during Ramadan. Built with React, TypeScript, and modern web technologies.

## ✨ Features

- **Interactive Map View**: Browse verified mosques on an interactive map interface
- **List View**: View all mosques in a convenient list format with filtering options
- **Community Submissions**: Users can submit new mosque locations for review
- **Admin Portal**: Secure admin dashboard to review and approve pending submissions
- **Menu Information**: See what takjil items are available at each location
- **Mobile-First Design**: Optimized for mobile devices with a clean, modern UI
- **Dark Mode Support**: Automatic dark mode based on system preferences

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/takjilfinder.git
cd takjilfinder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Enable Anonymous Authentication in your Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable "Anonymous" provider

5. Create a Firestore database:
   - Go to Firestore Database
   - Create database in production mode (or test mode for development)
   - Create a collection named `mosques`

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## 🚀 Deploying to Vercel

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions and troubleshooting guide.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.4
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols
- **Fonts**: Plus Jakarta Sans
- **Backend**: Firebase (Firestore + Anonymous Auth)
- **Maps**: OpenStreetMap (Leaflet + React Leaflet)

## 📱 App Structure

```
takjilfinder/
├── components/
│   ├── BottomNav.tsx       # Bottom navigation bar
│   └── SplashScreen.tsx    # App splash screen
├── views/
│   ├── HomeMap.tsx         # Interactive map view
│   ├── ListView.tsx        # List of mosques
│   ├── SubmitForm.tsx      # Submit new mosque form
│   ├── AdminPortal.tsx     # Admin login
│   ├── AdminPending.tsx    # Review pending submissions
│   └── AboutPage.tsx       # About the app
├── store.tsx               # Global state management
├── types.ts                # TypeScript type definitions
└── App.tsx                 # Main app component
```

## 🔐 Admin Access

Admin credentials are configured via environment variables:
- Set `VITE_ADMIN_ACCOUNT` in your `.env` file (default: admin@takjilfinder.com)
- Set `VITE_ADMIN_PASSWORD` in your `.env` file (default: admin123)

> ⚠️ Note: This is a demo implementation using localStorage for admin sessions. In production, implement proper Firebase Authentication with admin roles and secure credential management.

## 📊 Data Storage

Uses Firebase Firestore for real-time data persistence:
- **Collection**: `mosques` - stores all mosque submissions
- **Authentication**: Anonymous sign-in for all users
- **Real-time updates**: Automatic sync when data changes
- **Status tracking**: pending/verified/rejected workflow

## 🎨 Design Features

- Clean, modern UI with Islamic geometric patterns
- Smooth animations and transitions
- Responsive design optimized for mobile devices
- Accessible color scheme with proper contrast
- Bottom navigation for easy thumb access

## 🚧 Future Enhancements

- [ ] Real-time location tracking with geolocation
- [ ] Push notifications for nearby mosques
- [ ] User reviews and ratings
- [ ] Photo uploads for mosques
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) capabilities
- [ ] Email/social authentication for admins
- [ ] Search and filter functionality
- [ ] Clustering for map markers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with love for the Muslim community
- Inspired by the spirit of Ramadan and community sharing
- Icons by Google Material Symbols
- Font by Plus Jakarta Sans

## 📞 Contact

For questions or suggestions, please open an issue on GitHub.

---

Made with ❤️ during Ramadan

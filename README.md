# 🕌 TakjilFinder

A community-driven web application to help people find mosques offering takjil (iftar meals) during Ramadan. Built with React, TypeScript, and modern web technologies.

![TakjilFinder Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

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

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.4
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols
- **Fonts**: Plus Jakarta Sans

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

For testing purposes, use these credentials:
- **Email**: admin@takjilfinder.com
- **Password**: admin123

> ⚠️ Note: This is a demo implementation. In production, implement proper authentication and authorization.

## 📊 Data Storage

Currently uses localStorage for data persistence. The app includes:
- Mock mosque data for demonstration
- Status tracking (pending/verified/rejected)
- User authentication state

## 🎨 Design Features

- Clean, modern UI with Islamic geometric patterns
- Smooth animations and transitions
- Responsive design optimized for mobile devices
- Accessible color scheme with proper contrast
- Bottom navigation for easy thumb access

## 🚧 Future Enhancements

- [ ] Integration with real mapping services (Google Maps, Mapbox)
- [ ] Backend API with database (Firebase, Supabase)
- [ ] Real-time location tracking
- [ ] Push notifications for nearby mosques
- [ ] User reviews and ratings
- [ ] Photo uploads for mosques
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) capabilities

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

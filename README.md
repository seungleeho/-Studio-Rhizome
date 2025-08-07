# Seoul Travel Planner 🇰🇷

A modern, interactive web application that helps first-time visitors plan their perfect trip to Seoul, South Korea. Get personalized itineraries based on your interests, stay duration, and travel pace.

![Seoul Travel Planner](https://img.shields.io/badge/Seoul-Travel%20Planner-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.6-blue)

## ✨ Features

- **🎯 Personalized Itineraries**: Get custom travel plans based on your interests and stay duration
- **🏛️ 20+ Curated Attractions**: Handpicked locations across 6 categories (Historical, Modern, Shopping, Food, Nature, Culture)
- **⚡ Smart Route Planning**: Optimized daily schedules that group attractions by district for efficiency
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **📋 Export & Share**: Download your itinerary as text or share with friends
- **🚇 Transportation Tips**: Subway information and local travel advice
- **🍜 Local Recommendations**: Food and dining suggestions for each district

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seoul-travel-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to start planning your Seoul adventure!

## 🏗️ How It Works

### 1. Trip Planning
- Choose your stay duration (1-14 days)
- Select your interests from 6 categories
- Pick your travel pace (Relaxed, Moderate, or Intensive)

### 2. Smart Algorithm
The app uses an intelligent route planning algorithm that:
- Prioritizes high-importance attractions
- Groups locations by district for efficiency
- Respects daily time budgets based on your pace
- Optimizes travel routes to minimize transit time

### 3. Personalized Results
Get a detailed day-by-day itinerary with:
- Attraction descriptions and Korean names
- Subway directions and best visit times
- Local tips and recommendations
- District-specific food and transport advice

## 🏛️ Attraction Categories

- **🏛️ Historical Sites**: Palaces, temples, and traditional architecture
- **🏙️ Modern Seoul**: Skyscrapers, contemporary architecture, and urban attractions  
- **🛍️ Shopping**: Markets, districts, and retail experiences
- **🍜 Food & Markets**: Traditional markets, street food, and local cuisine
- **🌳 Nature & Parks**: Mountains, rivers, and outdoor activities
- **🎭 Culture & Museums**: Museums, temples, and cultural experiences

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS with custom Korean-inspired themes
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── PlanningForm.jsx    # Multi-step planning form
│   └── ItineraryDisplay.jsx # Results display
├── data/               # Static data
│   └── seoulAttractions.js # Attraction database
├── utils/              # Utilities
│   └── routePlanner.js     # Route planning algorithm
├── App.jsx             # Main app component
├── App.css             # Custom styles
├── index.css           # Tailwind imports
└── main.jsx            # App entry point
```

## 🎨 Design Features

- **Korean-inspired Color Palette**: Blue, red, and traditional hanbok colors
- **Responsive Layout**: Mobile-first design with desktop enhancements
- **Smooth Animations**: Fade-in effects and hover interactions
- **Modern Typography**: Noto Sans KR font for Korean text support
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🌟 Sample Itinerary

**3-Day Moderate Pace Example:**

**Day 1**: Historical Seoul
- Gyeongbokgung Palace (2.5h)
- Bukchon Hanok Village (2h)
- Insadong Shopping (3h)

**Day 2**: Modern & Shopping
- Lotte World Tower (2h)
- Myeongdong Shopping (3h)
- Namsan Seoul Tower (3h)

**Day 3**: Food & Culture
- Gwangjang Market (2h)
- National Museum of Korea (3h)
- Hongdae Nightlife (4h)

## 🚇 Transportation Integration

- Subway station information for each attraction
- T-money card recommendations
- Estimated travel times between locations
- Mobile app suggestions (Subway Korea, KakaoTaxi)

## 📱 Export Options

- **Text Export**: Download complete itinerary as .txt file
- **Social Sharing**: Share via native device sharing or copy to clipboard
- **Print-Friendly**: Clean layout for printing

## 🔮 Future Enhancements

- [ ] Real-time weather integration
- [ ] Budget estimation tools
- [ ] Hotel recommendations near planned routes
- [ ] Integration with booking platforms
- [ ] Offline PWA support
- [ ] Multi-language support (Korean, Japanese, Chinese)
- [ ] User reviews and ratings
- [ ] Photo galleries for attractions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Attraction data compiled from official Seoul tourism sources
- Korean translations verified for accuracy
- Transportation information based on Seoul Metropolitan Government data
- Cultural tips sourced from local Korean tourism experts

---

**안전한 여행 되세요!** (Have a safe trip!)

Made with ❤️ for first-time visitors to Seoul, South Korea
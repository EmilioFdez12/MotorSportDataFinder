# 🏎️ MotorSportDataFinder

A real-time data scraper for Formula 1 and MotoGP standings. This project automatically collects and updates race standings data, storing it in Firebase for easy access.

## 🚀 Features

- **Formula 1 Data**
  - Driver standings
  - Constructor standings

- **MotoGP Data**
  - Rider standings
  - Constructor standings

- **Automated Updates**
  - Runs every 30 minutes on race days (Sundays)
  - Automatic Firebase database updates
  - Change detection to avoid duplicate data

## 🛠️ Technologies

- Node.js
- Puppeteer for web scraping
- Firebase/Firestore
- GitHub Actions for automation

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MotorSportDataFinder.git

# SCORE2 Cardiovascular Risk Calculator

A modern, responsive web application for calculating 10-year cardiovascular risk using the SCORE2 algorithm, based on the ESC 2021 Guidelines.

## 🌐 Live Demo

[**Try the Calculator**](https://eyad6789.github.io/score2-calculator) - Deployed on GitHub Pages

## 📋 About

The SCORE2 Cardiovascular Risk Calculator is a clinical tool that helps healthcare professionals and individuals assess the 10-year risk of cardiovascular disease (heart attack and stroke). This implementation follows the European Society of Cardiology (ESC) 2021 Guidelines and uses the SCORE2 algorithm for patients aged 40-69 years and SCORE2-OP for patients aged 70+ years.

### Key Features

- ✅ **SCORE2 & SCORE2-OP Algorithm**: Implements both standard SCORE2 (40-69 years) and SCORE2-OP (70+ years)
- ✅ **Regional Calibration**: Supports Low, Moderate, High, and Very-High risk regions
- ✅ **Comprehensive Risk Factors**: Age, sex, smoking status, blood pressure, cholesterol, diabetes, BMI
- ✅ **Multiple Units**: Supports both mmol/L and mg/dL for cholesterol measurements
- ✅ **Heart Age Calculation**: Estimates cardiovascular age compared to chronological age
- ✅ **Personalized Recommendations**: Provides tailored lifestyle and medical recommendations
- ✅ **Risk Categorization**: Categorizes risk as Low, Moderate, High, or Very-High
- ✅ **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Accessible**: Follows accessibility best practices

## 🚀 Technology Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.7
- **UI Components**: Radix UI + shadcn/ui
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: GitHub Pages

## 🏥 Clinical Background

This calculator is based on the SCORE2 algorithm published in the European Heart Journal:

> **Reference**: Hageman SHJ, et al. SCORE2 risk prediction algorithms: new models to estimate 10-year risk of cardiovascular disease in Europe. Eur Heart J. 2021;42(25):2439-2454. [DOI: 10.1093/eurheartj/ehab309](https://academic.oup.com/eurheartj/article/42/25/2439/6297709)

### Risk Factors Included

- **Age**: 40-100 years (SCORE2: 40-69, SCORE2-OP: 70+)
- **Sex**: Male/Female
- **Geographic Region**: Low, Moderate, High, Very-High risk regions
- **Smoking Status**: Current smoker vs. non-smoker
- **Systolic Blood Pressure**: 80-250 mmHg
- **Total Cholesterol**: mmol/L or mg/dL
- **HDL Cholesterol**: Optional, for improved accuracy
- **Diabetes**: Optional, Type 1 or Type 2
- **BMI**: Optional, for additional risk stratification

### Risk Categories

- **Low Risk**: <2.5% (age <50) or <5% (age ≥50)
- **Moderate Risk**: 2.5-7.5% (age <50) or 5-10% (age ≥50)
- **High Risk**: 7.5-10% (age <50) or 10-15% (age ≥50)
- **Very-High Risk**: ≥10% (age <50) or ≥15% (age ≥50)

## 🛠️ Installation & Development

### Prerequisites

- Node.js 18.0.0 or higher
- npm, pnpm, or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/eyad6789/score2-calculator.git
   cd score2-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:5174
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 📁 Project Structure

```
score2-calculator/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui base components
│   │   └── ...            # Custom components
│   ├── lib/               # Utility functions
│   │   ├── score2Calculator.js  # Main algorithm implementation
│   │   └── utils.js       # Helper utilities
│   ├── hooks/             # Custom React hooks
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── docs/                  # Built files for GitHub Pages
├── public/                # Static assets
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🔬 Algorithm Implementation

The SCORE2 algorithm implementation includes:

- **Cox Regression Model**: Simplified implementation of the SCORE2 Cox proportional hazards model
- **Regional Calibration**: Adjustments for different European risk regions
- **Age-Specific Thresholds**: Different risk categories based on age groups
- **Heart Age Calculation**: Estimates cardiovascular age based on risk factors
- **Input Validation**: Comprehensive validation of all input parameters

### Key Functions

- `calculateSCORE2Risk()` - Main risk calculation function
- `categorizeRisk()` - Risk category determination
- `calculateHeartAge()` - Heart age estimation
- `generateRecommendations()` - Personalized recommendations
- `validateSCORE2Inputs()` - Input validation

## 🧪 Testing

The calculator has been tested with:
- Various age groups (40-100 years)
- Different risk factor combinations
- Edge cases and boundary values
- Cross-browser compatibility
- Mobile responsiveness

## ⚠️ Disclaimer

**IMPORTANT**: This calculator is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

The SCORE2 algorithm is designed for European populations and may not be applicable to other ethnic groups or geographic regions without appropriate calibration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style and conventions
2. Add appropriate comments for complex calculations
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure accessibility standards are maintained

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📚 References

1. Hageman SHJ, et al. SCORE2 risk prediction algorithms: new models to estimate 10-year risk of cardiovascular disease in Europe. Eur Heart J. 2021;42(25):2439-2454.
2. European Society of Cardiology. 2021 ESC Guidelines on cardiovascular disease prevention in clinical practice.
3. SCORE2 working group and ESC Cardiovascular risk collaboration.

## 📧 Contact

- **Developer**: Mohamed
- **Fix bugs**: Eyad
- **GitHub**: [@eyad6789](https://github.com/eyad6789)
- **Repository**: [score2-calculator](https://github.com/eyad6789/score2-calculator)

## 🎯 Roadmap

- [ ] Add support for additional risk factors (family history, ethnicity)
- [ ] Implement SCORE2-Diabetes algorithm
- [ ] Add multi-language support
- [ ] Include treatment benefit calculator
- [ ] Add data export functionality
- [ ] Implement risk trend visualization
- [ ] Add clinical decision support features

---

**Made with ❤️ for cardiovascular health awareness**

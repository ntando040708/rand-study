# RandStudy

RandStudy is a production-ready, enterprise-grade React and TypeScript web application designed to optimize study workflows through smart randomized scheduling, Pomodoro timeboxing, goal tracking, and gamification. Built with modular component architecture and robust local storage persistence, it ensures high performance, type safety, and a seamless user experience.

---

## 🚀 Features

* **Smart Scheduling Engine:** Dynamically generates daily study session distributions tailored to enrolled academic modules and user performance metrics.
* **Pomodoro & Focus Timers:** Integrated focus blocks with automated break intervals, visual progress rings, and state-resilient interval loops.
* **Advanced Analytics & Mood Tracking:** Correlates emotional wellbeing and stress levels with specific modules to identify optimal study patterns.
* **Dynamic Theming & Customization:** Runtime HSL/RGB color injection via CSS Custom Properties, supporting custom themes, presets, dark mode, and layout density controls.
* **Calendar Integration:** Defensive API abstraction layer supporting mock Google and Microsoft Graph OAuth calendar synchronization.
* **Gamification & Notifications:** Real-time streak tracking, goal progress bars, achievement badges, and a fully interactive notification center.
* **Accessibility & Security:** Fully accessible ARIA dialogs, background scroll-locking for modals, and type-safe browser storage error boundaries.

---

## 💻 Tech Stack

* **Framework:** React 18, TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **Icons:** Lucide React
* **State & Persistence:** React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`), Browser `localStorage` abstraction layer

---

## 🛠 Getting Started Locally

### Prerequisites
Ensure you have Node.js (v18 or higher) and npm installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ntando040708/rand-study.git](https://github.com/ntando040708/rand-study.git)
   cd rand-study

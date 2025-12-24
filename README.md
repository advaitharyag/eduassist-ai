# EduAssist AI - Your Smart Education Companion

Welcome to **EduAssist AI**, where we make learning and teaching a whole lot easier. This platform is built to help both students and teachers save time, stay organized, and get ahead using the power of **Google Gemini AI**.

Whether you're cramming for an exam or planning your next lecture, we've got a tool for that.

---

## � What's Inside?

We've split the app into two specific experiences so you get exactly what you need without the clutter.

### 🎒 For Students
*   **Today's Study Plan**: A simple, focused list of what you need to achieve today.
*   **Upcoming Deadlines**: Never miss a submission date again. We color-code them so you know what's urgent.
*   **AI Notes Generator**: Stuck on a topic? Just ask, and get comprehensive, structured study notes in seconds.
*   **Pseudocode to Code**: Paste your logic, and our AI acts as a tutor to help you write the real code.
*   **Progress Tracker**: Visual bars to show you how much of the syllabus you've crushed.

### 👩‍🏫 For Teachers
*   **Lecture Schedule**: A clear view of your classes, times, and rooms for the day.
*   **Syllabus Tracking**: Keep tabs on how far along you are with each class.
*   **Lecture Notes Generator**: Create detailed, professional lecture notes on any topic instantly.
*   **PPT Outline Creator**: Need slides? Get a perfectly structured 10-slide outline with content and visual ideas.
*   **Class Statistics**: Quick info on student attendance and assignments.

---

## 🛠️ Getting Started

You can run this project on your own machine in just a few steps.

### What You Need
*   **Node.js** (Version 18 or newer)
*   A **Google Gemini API Key** (It's free! Get one [here](https://aistudio.google.com/app/apikey))

### How to Run It

1.  **Install Dependencies**
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```
    *(If you use pnpm or yarn, you can use those too!)*

2.  **Set Up Your Keys**
    Create a file named `.env.local` in the main folder and add your API key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

3.  **Start the App**
    Fire up the development server:
    ```bash
    npm run dev
    ```

4.  **Launch!**
    Open your browser and go to `http://localhost:3000`. You're in!

---

## 🔐 Try It Out (Demo Accounts)

You don't need to register. We've pre-created these accounts for you to test the different roles:

**Login as a Student:**
*   **Email**: `student@test.com`
*   **Password**: `student123`

**Login as a Teacher:**
*   **Email**: `teacher@test.com`
*   **Password**: `teacher123`

---

## 🏗️ Under the Hood

We built this using some of the best modern web tools out there:
*   **Next.js 16**: For a fast, responsive, and seamless experience.
*   **Tailwind CSS**: Making everything look clean and modern.
*   **Google Gemini 1.5 Flash**: The brain behind our AI features.
*   **Shadcn UI**: For those beautiful, accessible components.

---



# AI Günlük Asistanım - React Native App

A simple AI-powered daily assistant app built with **React Native**, **Redux**, and **React Native Paper**.  
The app allows users to:

- Enter daily sentiment messages.
- View summaries and suggestions based on sentiment.
- Track weekly summaries.
- Work offline using AsyncStorage.
- Handle internet connection issues with popups and timeout alerts.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Offline Support](#offline-support)
- [Dependencies](#dependencies)
- [AI Models](#AI-Models)

---

## Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI or React Native CLI
- Android Studio or Xcode (for emulators/simulators)
- Git

### Android SDK Setup (for React Native CLI)

1. **Set `ANDROID_HOME` environment variable**:

   - Open **Start → Environment Variables → Edit System Environment Variables → Environment Variables**.
   - Under **User variables**, click **New**:

     ```
     Variable name: ANDROID_HOME
     Variable value: C:\Users\<YourUsername>\AppData\Local\Android\Sdk
     ```

     Replace `<YourUsername>` with your Windows username.

2. **Add SDK tools to PATH**:

   - Under **User variables → Path**, click **New** and add:

     ```
     %ANDROID_HOME%\platform-tools
     %ANDROID_HOME%\emulator
     ```

   > This ensures that `adb` and `emulator` commands work from any terminal.

3. **Verify setup**:

   Open a new terminal and run:

   ```powershell
   adb version
   emulator -list-avds
   echo $Env:ANDROID_HOME
   
   You should see the ADB version, a list of available emulators, and the SDK path.

4. **Create local.properties in your project**

   In android/local.properties, add:
   ```sdk.dir=C:\\Users\\<YourUsername>\\AppData\\Local\\Android\\Sdk```
   Use **double backslashes** \\ in Windows paths.

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/hanifidemir5/GunlukAIAsistanim.git
cd GunlukAIAsistanim
```

2. **Install dependencies**

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

3. **Install required packages (if not already included)**

```bash
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install react-native-paper
npm install @reduxjs/toolkit react-redux
```

---

## Running the App

### Using Expo

1. Start the Expo server:

```bash
expo start
```

2. Open the app on your device or simulator:
   - Press **i** for iOS simulator.
   - Press **a** for Android emulator.
   - Scan the QR code with your Expo Go app on a real device.

### Using React Native CLI

**Android:**

```bash
npx react-native run-android --list-devices
```

Chose desired device and the app will launch.

**iOS:**

```bash
npx react-native run-ios
```

---

## Folder Structure

```
/src
  /redux             # Redux slice and store
  /helpers           # Helper functions (e.g., GenerateResponsePipeline, FetchWithTimeout)
  /screens           # IndexPage.js, WeeklySummary.js
App.js
```

## Offline Support

- The app uses **AsyncStorage** to persist entries locally.
- Users can view past entries offline.
- If there’s **no internet connection**, the app shows a popup alert.
- Network requests have **timeout handling** — if the request takes too long, a timeout alert is shown.

---

## Dependencies

- **react-native-paper** — UI components like Button, Card, TextInput.
- **@reduxjs/toolkit** & **react-redux** — state management.
- **@react-native-async-storage/async-storage** — offline data persistence.
- **@react-native-community/netinfo** — detect internet connection.
- **React Native** — core framework.


## AI Models

### 1. Multilingual Sentiment Analysis

- **Model:** [tabularisai/multilingual-sentiment-analysis](https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis)
- **API:**  
  const response = await axios.post(
      https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis,
      { inputs: userText },
      {
        headers: {
          Authorization: `Bearer ${Config.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );
- **Purpose:** Detects the sentiment of the user's daily message (positive, neutral, negative) in multiple languages.
- **Usage in App:**
  - When a user submits a daily entry, the message is sent to this model.
  - The model returns sentiment labels with confidence score.
  - The app selects a sentiment label with the most confidence score.
  - A color is assigned to the entry based on selected sentiment (green for positive, yellow for neutral, red for negative).
  - Sentiment is displayed in the daily entry card and used in the weekly summary.

### 2. DeepSeek-R1:novita (Chat/Response Generation)

- **Model:** [deepseek-ai/DeepSeek-R1:novita](https://router.huggingface.co/v1/chat/completions)
- **API:**  
  const response = await axios.post(
    'https://router.huggingface.co/v1/chat/completions',
    {
      model: 'deepseek-ai/DeepSeek-R1:novita',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${Config.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  );
- **Purpose:** Generates summaries and suggestions based on the user’s message.
- **Usage in App:**
  - After sentiment analysis, the entry message is sent to this chat-completion model.
  - The model produces:
    - A **summary** of the user's message.
    - Personalized **advice or suggestions**.
  - These outputs are displayed in the daily entry card alongside the sentiment information.

### Integration Flow

1. User submits a daily message in **IndexPage**.  
2. **Multilingual Sentiment Analysis** model determines the sentiment.  
3. **DeepSeek-R1** model generates a summary and suggestion.  
4. Entry is stored in **AsyncStorage** and **Redux**.  
5. UI updates to reflect the sentiment, color, summary, and suggestion.  
6. Past entries and weekly summaries are displayed using stored data.


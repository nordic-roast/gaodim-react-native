# [GaoDim - Parking Ticket App]

GaoDim is a React Native application built using the Expo framework. It is designed to help users combat parking tickets by generating appeals with the help of GPT-3.5 model.

## Features

- Splash screen on startup
- User authentication with login screen
- Home screen with status of tickets and money saved
- Camera functionality for capturing images of parking tickets
- History screen to view past tickets and appeals

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (LTS version) 
- Expo Go mobile app for iOS or Android for testing 

### Installation

Clone the repository:

```bash
git clone git@github.com:nordic-roast/gaodim-react-native.git
cd gaodim-react-native
```

Install the dependencies

```bash
# Installing the rest of dependencies
npm install

# Install the Expo runtime for Web
npx expo install @expo/metro-runtime
```

### Running the Application
To start the Expo development server:

```bash
npx expo start
```



### Testing 
Building
To create a production build of the app, run:
```bash
expo build:android
```

or

```bash
expo build:ios

```


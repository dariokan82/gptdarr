# GPTDARR

## Description
GPTDARR is an innovative tool designed to integrate ChatGPT's advanced capabilities with Sonarr and Radarr. It assists in adding, monitoring, and obtaining detailed information about TV shows and movies, streamlining your media management experience.

THIS IS A PRIVATE FORK TO TRY AND INTEGRATE OVERSEER.

## Features
- Easy integration with Sonarr and Radarr
- AI-driven insights for media management
- Automated addition and tracking of TV shows and movies

## Example Chats
- [All Jason Stathham Action Movies (Bing + GPTDARR)](https://chat.openai.com/share/b62dfc8d-04a1-4eb6-bdef-9729ca3be892)
- [All Mazerunner Movies](https://chat.openai.com/share/bb2c80b0-f837-41b8-b405-d18d1c404e84)

![Screenshot of all Willy Wonker Movies being grabbed](screenshots/screenshot.png)

## Getting Started

### Prerequisites
- Node.js
- Sonarr and Radarr set up and running
- Basic knowledge of .env configurations

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/GPTDARR.git
   ```
2. Navigate to the cloned directory:
   ```
   cd GPTDARR
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Configuration
Run the configuration script:
```
node config.js
```
This will generate a `.env` file for your environment variables.

Alternatively, you can rename `.env.example` to `.env` and edit it manually.

### Usage
- For setting up the GPT, please follow the [GPT Setup Guide](GPT_SETUP.md).
- Run `npm install` at least once in the folder before running `node index.js`.
- Start the application:
  ```
  node app.js
  ```
- You can use PM2 or Linux Services to create an auto startup for the script.
- Its hosted on Port `8914`, you can either portforward that, or reverse proxy it and expose it that way.

## Note
Currently, the tool does not support language profiles but allows setting quality profiles for downloads. Please excuse the current state of config.js, I rushed that one for the release and if you'd like to recode / finish it, feel free, its in a working state right now, but its very ugly.

## Contributing
Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for more information.

## License
This project is licensed under the [MIT License](LICENSE).

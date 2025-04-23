# Generative AI Content Sandbox

1. Install all npm dependencies as specified in package-lock.json (npm install)
2. Add an OpenAI API key to the "VITE_OPENAI_API_KEY" key-value pair in the .env file
3. Start the sandbox by running "npm run dev"

This folder also contains two python scripts to process video recordings/slide images into a single .txt file containing base64 encoded strings for use with the sandbox. The Video node requires a file in this format. You can use the Image node without doing this, by just providing a directory of JPEG files.





# Introduction 
To run this website, use a code editor like VS Code, and launch a local server using the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

## Using your own meeting data with the prototypes

To view your own meeting data with the prototypes, follow these steps:

- Ensure your meeting transcripts are in a readable .txt or .vtt format
- Process your meeting recording or meeting slide images using the corresponding python scripts included with the Content Sandbox.
- This will generate .txt files containing base64 encoded strings of the video frames/slide images
- Use the transcript and image .txt files along with the Recap Template node in the Sandbox
- Copy the .JSON output into the corresponding JSON files in the concept folder here, and replace the meeting<>.txt file with the base64 encoded image file you created
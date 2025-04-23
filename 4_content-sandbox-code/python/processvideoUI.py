import os
import cv2
import base64
import tkinter as tk
from tkinter import filedialog, messagebox

def process_video(videopath, seconds_per_frame=20):
    video_path = videopath
    base64Frames = []
    base_video_path, _ = os.path.splitext(video_path)

    video = cv2.VideoCapture(video_path)
    total_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = video.get(cv2.CAP_PROP_FPS)
    frames_to_skip = int(fps * seconds_per_frame)
    curr_frame = 0

    while curr_frame < total_frames - 1:
        video.set(cv2.CAP_PROP_POS_FRAMES, curr_frame)
        success, frame = video.read()
        if not success:
            break
        _, buffer = cv2.imencode(".jpg", frame)
        base64Frames.append(base64.b64encode(buffer).decode("utf-8"))
        curr_frame += frames_to_skip
    video.release()

    base64_path = f"{base_video_path}.txt"
    
    with open(base64_path, 'w') as fp:
        fp.write("\n".join(base64Frames))

    messagebox.showinfo("Success", f"Extracted {len(base64Frames)} frames and saved to {base64_path}")

def browse_file():
    file_path = filedialog.askopenfilename(filetypes=[("MP4 files", "*.mp4")])
    if file_path:
        process_video(file_path)

# Create the GUI application
app = tk.Tk()
app.title("Video to Base64 Converter")

# Set window size
app.geometry("400x200")

# Add a label
label = tk.Label(app, text="Select an MP4 file to convert:")
label.pack(pady=20)

# Add a button to browse files
browse_button = tk.Button(app, text="Browse", command=browse_file)
browse_button.pack(pady=10)

# Run the application
app.mainloop()

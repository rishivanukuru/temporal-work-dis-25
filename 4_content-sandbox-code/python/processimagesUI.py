import os
import base64
import tkinter as tk
from tkinter import filedialog, messagebox
import subprocess

def encode_images_to_base64(folder_path, output_file):
    try:
        # Get all JPEG files in the folder
        jpeg_files = [file for file in os.listdir(folder_path) if file.lower().endswith(('.jpg', '.jpeg'))]
        
        if not jpeg_files:
            messagebox.showinfo("No Images Found", "No JPEG images found in the selected folder.")
            return

        with open(output_file, 'w') as text_file:
            for jpeg_file in jpeg_files:
                file_path = os.path.join(folder_path, jpeg_file)
                with open(file_path, 'rb') as image_file:
                    # Encode the image to base64
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    # Write the encoded string to the text file
                    text_file.write(encoded_string + '\n')
        
        messagebox.showinfo("Success", f"Base64 encoded strings have been saved to: {output_file}")
    
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")

def select_folder():
    folder_path = filedialog.askdirectory(title="Select Folder Containing JPEG Images")
    if folder_path:
        output_file = os.path.join(folder_path, "images_base64.txt")
        encode_images_to_base64(folder_path, output_file)

# Create the GUI
def create_gui():
    root = tk.Tk()
    root.title("JPEG to Base64 Encoder")

    label = tk.Label(root, text="Select a folder containing JPEG images to encode.")
    label.pack(pady=10)

    select_button = tk.Button(root, text="Select Folder", command=select_folder)
    select_button.pack(pady=5)

    exit_button = tk.Button(root, text="Exit", command=root.quit)
    exit_button.pack(pady=5)

    root.mainloop()

if __name__ == "__main__":
    create_gui()

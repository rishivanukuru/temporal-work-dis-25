import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

const ImageUploadNode = ({ id }) => {
  const { updateNodeData } = useReactFlow();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullVideo, setFullVideo] = useState(false);
  const [samplingInterval, setSamplingInterval] = useState(1);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileReaders = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders)
        .then((base64Images) => {
          setImages(base64Images);
          setCurrentImageIndex(0);

          updateNodeData(id, {
            images: base64Images,
            currentImage: base64Images[0],
            singleImagePrompt: generateSingleImagePrompt(base64Images[0]),
            multiImagePrompt: generateMultiImagePrompt(base64Images, samplingInterval),
            fullvideo: fullVideo,
          });
        })
        .catch((error) => console.error("Error reading files:", error));
    }
  };

  const handleSliderChange = (event) => {
    const newIndex = Number(event.target.value);
    setCurrentImageIndex(newIndex);

    updateNodeData(id, {
      currentImage: images[newIndex],
      singleImagePrompt: generateSingleImagePrompt(images[newIndex]),
      multiImagePrompt: generateMultiImagePrompt(images, samplingInterval),
      fullvideo: fullVideo,
    });
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setFullVideo(isChecked);

    updateNodeData(id, {
      fullvideo: isChecked,
      currentImage: images[currentImageIndex],
      singleImagePrompt: generateSingleImagePrompt(images[currentImageIndex]),
      multiImagePrompt: generateMultiImagePrompt(images, samplingInterval),
    });
  };

  const handleSamplingIntervalChange = (event) => {
    const newInterval = Number(event.target.value);
    setSamplingInterval(newInterval);

    updateNodeData(id, {
      samplingInterval: newInterval,
      currentImage: images[currentImageIndex],
      singleImagePrompt: generateSingleImagePrompt(images[currentImageIndex]),
      multiImagePrompt: generateMultiImagePrompt(images, newInterval),
      fullvideo: fullVideo,
    });
  };

  useEffect(() => {
    if (images.length > 0) {
      updateNodeData(id, {
        currentImage: images[currentImageIndex],
        singleImagePrompt: generateSingleImagePrompt(images[currentImageIndex]),
        multiImagePrompt: generateMultiImagePrompt(images, samplingInterval),
        fullvideo: fullVideo,
      });
    }
  }, [images, currentImageIndex, samplingInterval, fullVideo, id, updateNodeData]);

  const generateSingleImagePrompt = (image) => {
    return {
      role: 'user',
      content: [
        { type: "text", text: "Here is an image" },
        { type: "image_url", image_url: { url: `data:image/jpg;base64,` + image, detail: "high" } },
      ],
    };
  };

  const generateMultiImagePrompt = (images, interval) => {
    const sampledImages = images.filter((_, index) => index % interval === 0);
    return sampledImages.map((image, index) => ({
      role: 'user',
      content: [
        { type: "text", text: "Frame " + index },
        { type: "image_url", image_url: { url: `data:image/jpg;base64,` + image, detail: "high" } },
      ],
    }));
  };

  return (
    <>
      <div style={{ margin: '20px', backgroundColor: 'black', color: 'white', padding: '10px' }}>
        <input
          style={{ color: 'white', padding: '10px 0px', fontSize: 'small' }}
          type="file"
          accept="image/jpeg"
          multiple
          onChange={handleFileChange}
        />

        {images.length > 0 && (
          <>
            <div
              style={{
                marginTop: '10px',
                border: '4px solid #000',
                height: '300px',
                width: '500px',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={`data:image/jpeg;base64,${images[currentImageIndex]}`}
                alt="frame"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
            </div>
            <input
              type="range"
              className='nowheel nodrag'
              min="0"
              max={images.length - 1}
              value={currentImageIndex}
              onChange={handleSliderChange}
              style={{ width: '100%', marginTop: '10px' }}
            />
            <label style={{ marginTop: '10px', display: 'block', color: 'white' }}>
              <input
                type="checkbox"
                className='nowheel nodrag'
                checked={fullVideo}
                onChange={handleCheckboxChange}
                style={{ marginRight: '5px' }}
              />
              Full Video
            </label>
            <label style={{ marginTop: '10px', display: 'block', color: 'white' }}>
              Sampling Interval:
              <input
                type="number"
                className='nowheel nodrag'
                value={samplingInterval}
                onChange={handleSamplingIntervalChange}
                style={{ marginLeft: '10px', width: '50px' }}
                min="1"
              />
            </label>
          </>
        )}
      </div>

      <Handle style={{ width: '20px', height: '20px' }} type="source" position={Position.Right} />
    </>
  );
};

export default ImageUploadNode;

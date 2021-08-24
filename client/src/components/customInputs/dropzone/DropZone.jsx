import React, { useRef, useState, useEffect  } from 'react';
import './DropZone.css';

const Dropzone = (props) => {
  const fileInputRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [imageName, imageUpdate] = useState("");

  useEffect(() => {
    let filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    try{
      const reader = new FileReader();
      reader.readAsDataURL(filteredArr[0]);
      reader.onload = function(e) {
        if(props.imageValue.result !== e.target.result || props.imageValue.name !== imageName){
          props.imageChange({"name": imageName, "result": e.target.result});
        }
        // modalImageRef.current.style.backgroundImage = `url(${e.target.result})`;
      }
    }catch(error){}
  }, [selectedFiles, props, imageName]);

  const preventDefault = (e) => {
    e.preventDefault();
    // e.stopPropagation();
  }

  const dragOver = (e) => {
    preventDefault(e);
  }

  const dragEnter = (e) => {
    preventDefault(e);
  }

  const dragLeave = (e) => {
    preventDefault(e);
  }

  const fileDrop = (e) => {
    preventDefault(e);
    imageUpdate(e.dataTransfer.files[0].name);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }

  const filesSelected = () => {
    if (fileInputRef.current.files.length) {
      imageUpdate(fileInputRef.current.files[0].name);
      handleFiles(fileInputRef.current.files);
    }
  }

  const fileInputClicked = () => {
    fileInputRef.current.click();
  }

  const handleFiles = (files) => {
    if (validateFile(files[0])) {
      // afterEffect(files);
      setSelectedFiles(prevArray => [files[0]]);
    } else {
      files[0]['invalid'] = true;
      setSelectedFiles(prevArray => [files[0]]);
      setUnsupportedFiles(prevArray => [files[0]]);
    }
  }

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  }

  //{unsupportedFiles.length === 0 && validFiles.length ? <button className="file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button> : ''}
  return (
    <>
      <div className="container">
        {unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''}
        <div className="drop-container"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          onClick={fileInputClicked}
        >
          <div className="drop-message">
            <div className="upload-icon"></div>
            Drag & Drop files here or click to select file(s)
          </div>
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            multiple
            onChange={filesSelected}
          />
        </div>
      </div>
    </>
  );
}

export default Dropzone;

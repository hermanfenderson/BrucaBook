import React from 'react';
import { Upload, Icon, message } from 'antd';
import {firebaseUploader, firebaseGetDownloadURL} from '../helpers/firebase';


function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('Il file deve essere un JPG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Immagine < 2MB!");
  }
  return isJPG && isLt2M;
}

class ImageUploader extends React.Component {
	
  state = {
    loading: false,
  };
  
  componentDidMount = () => {
  	firebaseGetDownloadURL("pippo/pluto/avatar123.jpg",this.setDefaultImg);
  }
  
  handleChange = (info) => {
  	console.log(info.file.status);
  	if (info.file.status === 'uploading') {
      this.setState({ imageUrl: null, loading: true });
      return;
    }
    if (info.file.status === 'done') {
    let imageUrl = info.file.url;
      this.setState({
        imageUrl: imageUrl,
        loading: false,
      });
    }
  }
  
  customUploader = (obj) => {obj.file.status='uploading'; this.handleChange(obj); obj.onSuccess = this.handleChange; firebaseUploader(obj);}
 
  setDefaultImg = (imageUrl) => {
  	 this.setState({
        imageUrl: imageUrl,
        loading: false,
      });
  }
  
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="pippo/pluto/avatar123.jpg"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        customRequest={this.customUploader}
      >
        {imageUrl ? <img src={imageUrl} alt="" /> : uploadButton}
      </Upload>
    );
  }
}

export default ImageUploader;



//Image uploader parla con Firebase
//Riceve in input un eventuale file come proprietà ed eventualmente chiama una callback per dire che ha finito...
//La callback corrisponde al valore che assume un campo di una form... blank se non ho un immagine, uploading se sto caricando, e infine uguale a fullName
//Aggiungo la possibilità di vedermi passare un link e gestirlo...


import React from 'react';
import { Upload, Icon, message } from 'antd';
import {firebaseUploader} from '../helpers/firebase';


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
  
  
  
  handleChange = (info) => {
  	if (info.file.status === 'uploading') {
      this.setState({ imageUrl: null, loading: true });
      if (this.props.setValue) this.props.setValue('uploading');
      return;
    }
    if (info.file.status === 'done') {
    let imageUrl = info.file.url;
      this.setState({
        imageUrl: imageUrl,
        loading: false,
      });
      if (this.props.setValue) this.props.setValue(imageUrl);
      
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
    const imageUrl = (this.state.imageUrl) ? this.state.imageUrl : this.props.imgFirebaseUrl;
    //if (this.props.fullName) firebaseGetDownloadURL(this.props.fullName,this.setDefaultImg); 
    return (
      <Upload
       disabled={(this.props.fullName==='')} //Se non so ancora dove salvare... mi fermo.
        name={this.props.fullName}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        customRequest={this.customUploader}
      >
        {(this.props.fullName && imageUrl) ? <img className="upload-img" src={imageUrl} alt="" /> : uploadButton}
      </Upload>
    );
  }
}

export default ImageUploader;



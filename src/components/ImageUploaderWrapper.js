//Consente di usare un ImageUploader in un form e persistere su firebase il valore
//In sostanza ha per value tre possibili stati
//Blank se non ho un immagine persistita su firebase
//FullName se ho una immagine
//Uploading se sto caricando (non devo salvare in questo caso)

import ImageUploader from './ImageUploader'
import React from 'react'

class ImageUploaderWrapper extends React.Component
		    {
		     render()
		     {
		     const {onChange, fullName, value, ...otherProps} = this.props;
	   	     //const onBlur = () => {onSubmit()};
	   	     const onChangeInput = (value) => {onChange(value)}
			return( <ImageUploader {...otherProps} fullName={fullName} imgFirebaseUrl={value} setValue={onChangeInput} />)
		     }
		    }

export default ImageUploaderWrapper;

import {SET_IMG_URL} from '../actions/rigaScontrino'


const initialState =  {
 ean: '',
 titolo: '',
 autore: '',
 prezzoListino: '',
 sconto: '',
 manSconto: false,
 prezzoUnitario: '',
 pezzi: '',
 prezzoTotale: '',
 imgUrl: ''
 };

export default function rigaScontrino(state = initialState, action) {
  switch(action.type) {
  	case SET_IMG_URL:
     	return {
     		...state, imgUrl: action.imgUrl
     	};
     
    default:
      return state;
  }
}

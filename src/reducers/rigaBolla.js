import {SET_IMG_URL} from '../actions/rigaBolla'


const initialState =  {
 ean: '',
 titolo: '',
 autore: '',
 prezzoListino: '',
 sconto1: '',
 sconto2: '',
 sconto3: '',
 manSconto: false,
 prezzoUnitario: '',
 pezzi: '',
 gratis: '',
 prezzoTotale: '',
 imgUrl: ''
 };

export default function rigaBolla(state = initialState, action) {
  switch(action.type) {
  	case SET_IMG_URL:
     	return {
     		...state, imgUrl: action.imgUrl
     	};
     
    default:
      return state;
  }
}

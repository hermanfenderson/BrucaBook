import { OPEN_MODAL, CLOSE_MODAL } from '../actions';

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
 prezzoTotale: '' 
 };

export default function rigaBolla(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}

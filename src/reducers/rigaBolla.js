import { OPEN_MODAL, CLOSE_MODAL } from '../actions';

const initialState =  {
 ean: '',
 titolo: '',
 autore: '',
 prezzoListino: '',
 sconto1: 0,
 sconto2: 0,
 sconto3: 0,
 manSconto: false,
 prezzoUnitario: '',
 pezzi: '',
 gratis: 0,
 prezzoTotale: '' 
 };

export default function rigaBolla(state = initialState, action) {
  switch(action.type) {
    default:
      return state;
  }
}

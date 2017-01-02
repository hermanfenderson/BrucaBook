const initialState =  {
  ean: '',
  titolo: '',
  autore: '',
  editore: '',
  prezzoListino: '',
  //imgUrl: '' da gestire in prospettiva...
};

export default function catalogItem(state = initialState, action) {
  switch (action.type) {     
    default:
      return state;
  }
}

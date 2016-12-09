const initialState =  {
  ean: '',
  titolo: '',
  autore: '',
  editore: '',
  prezzoListino: ''
};

export default function catalogItem(state = initialState, action) {
  switch (action.type) {     
    default:
      return state;
  }
}

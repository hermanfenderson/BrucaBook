const initialState =  {
  ean: '',
  titolo: '',
  autore: '',
  editore: '',
  prezzoListino: ''
};

export default function itemCatalog(state = initialState, action) {
  switch (action.type) {     
    default:
      return state;
  }
}

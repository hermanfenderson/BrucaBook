//Azioni per la gestione del form rigaBolla
import { actions } from 'react-redux-form';

function isPercentage(value)
{
  if ((value >=0) && (value < 100)) return true;
  return false;
}

function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  

export function updatePriceFromDiscount(model, value, formRigaBolla) 
{ 
  if (isPercentage(value))
  {
  var sconto1 = formRigaBolla.sconto1.value;
  var sconto2 = formRigaBolla.sconto2.value;
  var sconto3 = formRigaBolla.sconto3.value;
  var prezzoListino = formRigaBolla.prezzoListino.value;
   //Qui devo gestirmi quale e' il campo in ingresso...
  var changedField = model.split('.')[2];
  switch (changedField)
      {
      case 'sconto1' : sconto1 = value; break;
      case 'sconto2' : sconto2 = value; break;
      case 'sconto3' : sconto3 = value; break;
      case 'prezzoListino' : prezzoListino = value; break;  
      }      
  
  return (dispatch) => {
    //Devo cambiare leggermente qui per non aggiornare il prezzo di listino quando sarà chiamato da un libro vero
    dispatch(actions.setValidity(model, {isPercentage: true}));

    dispatch(actions.change(model, value));
    dispatch(actions.change(formRigaBolla.prezzoUnitario.model, discountPrice(prezzoListino, sconto1, sconto2, sconto3)));
   
  };
  }
  else 
  { 
  return (dispatch) => { 
    dispatch(actions.setValidity(model, {isPercentage: false}));
    dispatch(actions.change(model, value));  
    } 
  }
}

export function updatePriceFromListino(model, value, formRigaBolla) 
{ 
  var sconto1 = formRigaBolla.sconto1.value;
  var sconto2 = formRigaBolla.sconto2.value;
  var sconto3 = formRigaBolla.sconto3.value;
  var prezzoListino = formRigaBolla.prezzoListino.value;
  
  return (dispatch) => {
    //Devo cambiare leggermente qui per non aggiornare il prezzo di listino quando sarà chiamato da un libro vero
    dispatch(actions.change(model, value));
    dispatch(actions.change(formRigaBolla.prezzoUnitario.model, discountPrice(prezzoListino, sconto1, sconto2, sconto3)));
   
  };
}


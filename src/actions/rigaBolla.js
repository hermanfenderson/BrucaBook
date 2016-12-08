//Azioni per la gestione del form rigaBolla
import { actions } from 'react-redux-form';
import { isValidEAN, generateEAN, getBookByEAN13} from '../helpers/ean';

function isPercentage(value)
{
  if ((value >=0) && (value < 100)) return true;
  return false;
}

function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
}  

export function eanFocus() {
  return function(dispatch) {
    dispatch(actions.focus('form2.rigaBolla.ean'));
   }
 }  

export function fillWithRow(row) {
  return function(dispatch) {
  dispatch(actions.change('form2.rigaBolla.ean', row.ean));
  dispatch(actions.change('form2.rigaBolla.titolo', row.titolo));
  dispatch(actions.change('form2.rigaBolla.autore', row.autore));
  dispatch(actions.change('form2.rigaBolla.prezzoListino', row.prezzoListino));
  dispatch(actions.change('form2.rigaBolla.sconto1', row.sconto1));
     dispatch(actions.change('form2.rigaBolla.sconto2', row.sconto2));
     dispatch(actions.change('form2.rigaBolla.sconto3', row.sconto3));
    dispatch(actions.change('form2.rigaBolla.manSconto', row.manSconto));
  dispatch(actions.change('form2.rigaBolla.prezzoUnitario', row.prezzoUnitario));
    dispatch(actions.change('form2.rigaBolla.pezzi', row.pezzi));
    dispatch(actions.change('form2.rigaBolla.gratis', row.gratis));
    dispatch(actions.change('form2.rigaBolla.prezzoTotale', row.prezzoTotale));
    dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: true, isValidEan: true, EANFound: true}));
  
    
  }
}

export function staleCode(form)
{ 
  
  return (dispatch) => {
    dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: false, isValidEan: true, EANFound: true}));
  }
}

export function processEAN(value, form)
{
if (isValidEAN(value))
  {
    return (dispatch) => {
   dispatch(getBookByEAN(value, form));  
   }
  }
else
  {
  return (dispatch) => {
    dispatch(actions.setValidity(form.ean.model, {isValidCode: true, isValidEan: false, EANFound: true}));
    }
  }
}



export function getBookByEAN(value,form)
{return (dispatch) => {
  var book = getBookByEAN13(value);
 dispatch(storeBookInfo(book,form)); 
  }
}

export function storeBookInfo(book, form)
{
   return (dispatch) => {
     if (book)
       {  
       dispatch(actions.change(form.titolo.model, book.titolo));
       dispatch(actions.change(form.autore.model, book.autore));
       dispatch(actions.change(form.prezzoListino.model, book.prezzo));
       dispatch(actions.change(form.pezzi.model, "1"));
       if (!form.manSconto.value)
         { const discount = discountPrice(book.prezzo, form.sconto1.value, form.sconto2.value, form.sconto3.value);
           dispatch(actions.change(form.prezzoUnitario.model, discount));
           dispatch(actions.change(form.prezzoTotale.model, discount));
         }
       else 
         {
           dispatch(actions.change(form.prezzoUnitario.model, book.prezzo));
           dispatch(actions.change(form.prezzoTotale.model, book.prezzo));
         }
       dispatch(actions.setValidity(form.ean.model, {isValidCode: true, isValidEan: true, EANFound: true}));
       dispatch(actions.focus(form.pezzi.model));
       }
     else  
       { 
       dispatch(actions.change(form.titolo.model,""));
       dispatch(actions.change(form.autore.model,""));
       dispatch(actions.change(form.prezzoListino.model, ""));
       dispatch(actions.setValidity(form.ean.model, {isValidCode: true, isValidEan: true, EANFound: false}));
       }
   }
}

export function changeCodeToEAN(form)
{   //Candidato a diventare un EAN interno
  return (dispatch) => {
    if (form.ean.value > 0 && form.ean.value.length < 12) {
    dispatch(actions.setValidity(form.ean.model, {isValidCode: true, isValidEan: false, EANFound: true}));
    dispatch(actions.change(form.ean.model, generateEAN(form.ean.value)));
    var book = getBookByEAN13(generateEAN(form.ean.value));
    dispatch(storeBookInfo(book,form)); 
    }  
    else 
    {
    dispatch(actions.setValidity(form.ean.model, {isValidCode: false, isValidEan: true, EANFound: true}));
    dispatch(actions.change(form.ean.model, form.ean.value));
    }
  }  
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
    dispatch(actions.setValidity(model, {isPercentage: true}));

    dispatch(actions.change(model, value));
    dispatch(actions.change(formRigaBolla.prezzoUnitario.model, discountPrice(prezzoListino, sconto1, sconto2, sconto3)));
    dispatch(actions.change(formRigaBolla.prezzoTotale.model, (formRigaBolla.pezzi.value * discountPrice(prezzoListino, sconto1, sconto2, sconto3)).toFixed(2)));
    
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

export function updatePriceFromListino(value, formRigaBolla) 
{ 
  var sconto1 = formRigaBolla.sconto1.value;
  var sconto2 = formRigaBolla.sconto2.value;
  var sconto3 = formRigaBolla.sconto3.value;
  var prezzoListino = value;
  
  return (dispatch) => {
     dispatch(actions.change(formRigaBolla.prezzoUnitario.model, discountPrice(prezzoListino, sconto1, sconto2, sconto3)));
   
  };
}



export function updateTotalPriceFromPrice(value, formRigaBolla)
{
 if (isNaN(value))  
    {
    return (dispatch) => {
     dispatch(actions.setValidity(formRigaBolla.prezzoUnitario.model, {isNumber: false}));
    }
    } 
  else 
    {
      return (dispatch) => {
     dispatch(actions.setValidity(formRigaBolla.prezzoUnitario.model, {isNumber: true})); 
     dispatch(actions.change(formRigaBolla.prezzoUnitario.model,value));
     dispatch(actions.change(formRigaBolla.prezzoTotale.model, (value*formRigaBolla.pezzi.value).toFixed(2)));
  }
 }     
}  

export function updateTotalPriceFromPezzi(value, formRigaBolla)
{
 if (!(value>=0))  
    {
    return (dispatch) => {
    //Devo cambiare leggermente qui per non aggiornare il prezzo di listino quando sarà chiamato da un libro vero
    dispatch(actions.setValidity(formRigaBolla.pezzi.model, {isPositive: false}));
    }
    } 
  else 
    {
      return (dispatch) => {
      dispatch(actions.setValidity(formRigaBolla.pezzi.model, {isPositive: true}));
     dispatch(actions.change(formRigaBolla.pezzi.model, value));
     dispatch(actions.change(formRigaBolla.prezzoTotale.model, (value*formRigaBolla.prezzoUnitario.value).toFixed(2)));
  }
 }     
}  

export function toggleManSconto(value, formRigaBolla)
{return (dispatch) => {
  dispatch(actions.change(formRigaBolla.manSconto.model, value));
  if (value) 
    {
       dispatch(actions.change(formRigaBolla.sconto1.model, ""));
       dispatch(actions.change(formRigaBolla.sconto2.model, ""));
       dispatch(actions.change(formRigaBolla.sconto3.model, ""));
      dispatch(actions.change(formRigaBolla.prezzoUnitario.model, formRigaBolla.prezzoListino.value));
      dispatch(actions.change(formRigaBolla.prezzoTotale.model, (formRigaBolla.prezzoListino.value * formRigaBolla.pezzi.value).toFixed(2)));
    }
  else 
    {
      dispatch(actions.change(formRigaBolla.prezzoUnitario.model, formRigaBolla.prezzoListino.value));
      dispatch(actions.change(formRigaBolla.prezzoTotale.model, (formRigaBolla.prezzoListino.value * formRigaBolla.pezzi.value).toFixed(2)));
    }
 }
}
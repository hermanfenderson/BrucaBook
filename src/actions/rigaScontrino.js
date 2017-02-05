export const SET_IMG_URL = 'SET_IMG_URL';


//Azioni per la gestione del form rigaBolla
import { actions } from 'react-redux-form';
import { isValidEAN, generateEAN} from '../helpers/ean';
import {searchCatalogItem, searchIBSItem, updateCatalogItem, setStatus, fillFormWithItem} from './catalog';

function isPercentage(value)
{
  if ((value >=0) && (value < 100)) return true;
  return false;
}

function discountPrice(prezzoListino, sconto)
{  
  return ((1 - sconto/100) * prezzoListino).toFixed(2);    
}  

export function setImgUrl(imgUrl)
{
	return {
		type: SET_IMG_URL,
		imgUrl
	}
}

export function eanFocus() {
  return function(dispatch) {
    dispatch(actions.focus('form2.rigaScontrino.ean'));
   }
 }  

export function fillWithRow(row) {
  return function(dispatch) {
  dispatch(actions.change('form2.rigaScontrino.ean', row.ean));
  dispatch(actions.change('form2.rigaScontrino.titolo', row.titolo));
  dispatch(actions.change('form2.rigaScontrino.autore', row.autore));
  dispatch(actions.change('form2.rigaScontrino.prezzoListino', row.prezzoListino));
  dispatch(actions.change('form2.rigaScontrino.sconto', row.sconto));
    dispatch(actions.change('form2.rigaScontrino.manSconto', row.manSconto));
  dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', row.prezzoUnitario));
    dispatch(actions.change('form2.rigaScontrino.pezzi', row.pezzi));
    dispatch(actions.change('form2.rigaScontrino.prezzoTotale', row.prezzoTotale));
    dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: true, isValidEan: true, EANFound: true}));
    dispatch(setImgUrl(row.imgUrl));
    
  }
}

export function staleCode()
{ 
  
  return (dispatch) => {
    dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: false, isValidEan: true, EANFound: true}));
  }
}

export function processEAN(value,formValue)
{
  if (isValidEAN(value))
  {
    return (dispatch) => {
   dispatch(getBookByEAN(value,formValue));  
   }
  }
else
  {
  return (dispatch) => {
     dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: true, isValidEan: false, EANFound: true}));
    }
  }
}



function isComplete(book)
{
	var isComplete = true;
	if (book.titolo.length === 0) isComplete = false;
	if (book.autore.length === 0) isComplete = false;
	if (book.editore.length === 0) isComplete = false;
	if (!(book.prezzoListino > 0)) isComplete = false;
	return(isComplete)
}

//Qui ci arrivo in caso di item incompleto... viene chiamato premendo submit sul form del catalogo dal modal...
export function updateCatalogAndFillForm(book)
{
	return (dispatch, getState) => {
		const formValue = getState().form2.forms.rigaScontrino;
  	 dispatch(setStatus("IDLE","")); 
		dispatch(storeBookInfo(book,formValue));  
        dispatch(updateCatalogItem(book));  
	}
}

export function getBookByEAN(value,formValue)
{return (dispatch) => {
 var promise = dispatch(searchCatalogItem(value));
   promise.then(
             (payload) => {
                          var book = payload.val();
                          if (!book) {
                          //se non lo ho in catalogo...lo cerco su IBS  
                              dispatch(searchIBSItem(value)).then( (book, ean) => {
                              	                            //Qui devo fare branch se non ho trovato il libro in IBS o se è incompleto...lo gestisco con la funzione definita qui sopra
                              	                            if (isComplete(book))
                              	                               {
                                                            	book['ean']=value; 
                                                            	dispatch(storeBookInfo(book,formValue));  
                                                            	dispatch(updateCatalogItem(book));  
                                                            	dispatch(setStatus("IDLE","")); //me ne fotto della const
                                                            	}
															else 
																{   //Unizializzo la form del catalogo con quello che ho
																    dispatch(setStatus("INCOMPLETE",""));
																	dispatch(fillFormWithItem(value,book));
																	console.log("mah!");
																}
                                                            })  
                                      } 
                          else 
                              {
                              //Se lo ho in catalogo...lo passo e basta...
                              	dispatch(storeBookInfo(book,formValue));
                              	dispatch(setStatus("IDLE","")); //me ne fotto della const
                              }
                          }
             )   
 
  }
}

export function storeBookInfo(book,formValue)
{  return (dispatch) => {
     if (book)
       {  
console.log(formValue);
       dispatch(setImgUrl(book.imgUrl));
       dispatch(actions.change('form2.rigaScontrino.titolo', book.titolo));
       dispatch(actions.change('form2.rigaScontrino.autore', book.autore));
       dispatch(actions.change('form2.rigaScontrino.prezzoListino', book.prezzoListino));
       dispatch(actions.change('form2.rigaScontrino.pezzi', "1"));
           
       if (!formValue.manSconto)
         { const discount = discountPrice(book.prezzoListino, formValue.sconto);
           dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', discount));
           dispatch(actions.change('form2.rigaScontrino.prezzoTotale', discount));
         }
       else 
         {
           dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', book.prezzoListino));
           dispatch(actions.change('form2.rigaScontrino.prezzoTotale', book.prezzoListino));
         }
       dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: true, isValidEan: true, EANFound: true}));
       dispatch(actions.focus('form2.rigaScontrino.pezzi'));
       }
     else  
       { 
       dispatch(actions.change('form2.rigaScontrino.titolo',""));
       dispatch(actions.change('form2.rigaScontrino.autore',""));
       dispatch(actions.change('form2.rigaScontrino.prezzoListino', ""));
       dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: true, isValidEan: true, EANFound: false}));
       }
   }
 
}

export function changeCodeToEAN(formValues)
{   //Candidato a diventare un EAN interno
  return (dispatch) => {
    if (formValues.ean > 0 && formValues.ean.length < 12) {
    dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: true, isValidEan: false, EANFound: true}));
    dispatch(actions.change('form2.rigaScontrino.ean', generateEAN(formValues.ean)));  
    dispatch(searchCatalogItem(generateEAN(formValues.ean))).then(
           (payload) => {dispatch(storeBookInfo(payload.val(),formValues));
           	             dispatch(setStatus("IDLE",""));
                         }
             )  
    }  
    else 
    {
    //Non ho l'oggetto a catalogo...si tratta di codici interni... se non ci sono non ha senso cercarli...
    dispatch(actions.setValidity('form2.rigaScontrino.ean', {isValidCode: false, isValidEan: true, EANFound: true}));
    //dispatch(actions.change(form.ean.model, form.ean.value));
    }
  }  
}

export function updatePriceFromDiscount(model,value, formValues) 
{ 
   if (isPercentage(value))
  {
  var sconto = formValues.sconto;
   var prezzoListino = formValues.prezzoListino;
   //Qui devo gestirmi quale e' il campo in ingresso...
  var changedField = model.split('.')[2];
  switch (changedField)
      {
      case 'sconto' : sconto = value; break;
      case 'prezzoListino' : prezzoListino = value; break;  
      }      
  
  return (dispatch) => {
    dispatch(actions.setValidity(model, {isPercentage: true}));

    dispatch(actions.change(model, value));
    dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', discountPrice(prezzoListino, sconto)));
    dispatch(actions.change('form2.rigaScontrino.prezzoTotale', (formValues.pezzi * discountPrice(prezzoListino, sconto)).toFixed(2)));
    
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

export function updatePriceFromListino(value, formValues) 
{ 
  var sconto = formValues.sconto;
    var prezzoListino = value;
  
  return (dispatch) => {
     dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', discountPrice(prezzoListino, sconto)));
   
  };
}



export function updateTotalPriceFromPrice(value, formValues)
{
 if (isNaN(value))  
    {
    return (dispatch) => {
     dispatch(actions.setValidity('form2.rigaScontrino.prezzoUnitario', {isNumber: false}));
    }
    } 
  else 
    {
      return (dispatch) => {
     dispatch(actions.setValidity('form2.rigaScontrino.prezzoUnitario', {isNumber: true})); 
     dispatch(actions.change('form2.rigaScontrino.prezzoUnitario',value));
     dispatch(actions.change('form2.rigaScontrino.prezzoTotale', (value*formValues.pezzi).toFixed(2)));
  }
 }     
}  

export function updateTotalPriceFromPezzi(value, formValues)
{
 if (!Number.isInteger(parseFloat(value)))  
    {
    return (dispatch) => {
    //Devo cambiare leggermente qui per non aggiornare il prezzo di listino quando sarà chiamato da un libro vero
    dispatch(actions.setValidity('form2.rigaScontrino.pezzi', {isNumber: false}));
    }
    } 
  else 
    {
      return (dispatch) => {
      dispatch(actions.setValidity('form2.rigaScontrino.pezzi', {isNumber: true}));
     dispatch(actions.change('form2.rigaScontrino.pezzi', value));
     dispatch(actions.change('form2.rigaScontrino.prezzoTotale', (value*formValues.prezzoUnitario).toFixed(2)));
  }
 }     
}  

export function toggleManSconto(value, formValues)
{return (dispatch) => {
  dispatch(actions.change('form2.rigaBolla.manSconto', value));
  if (value) 
    {
       dispatch(actions.change('form2.rigaScontrino.sconto', ""));
       dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', formValues.prezzoListino));
      dispatch(actions.change('form2.rigaScontrino.prezzoTotale', (formValues.prezzoListino * formValues.pezzi).toFixed(2)));
    }
  else 
    {
      dispatch(actions.change('form2.rigaScontrino.prezzoUnitario', formValues.prezzoListino));
      dispatch(actions.change('form2.rigaScontrino.prezzoTotale', (formValues.prezzoListino * formValues.pezzi).toFixed(2)));
    }
 }
}

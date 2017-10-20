export const SET_IMG_URL = 'SET_IMG_URL';


//Azioni per la gestione del form rigaBolla
import { actions } from 'react-redux-form';
import { isValidEAN, generateEAN} from '../helpers/ean';
import {searchCatalogItem, searchIBSItem, updateCatalogItem, setStatus, fillFormWithItem} from './oldCatalog';

function isPercentage(value)
{
  if ((value >=0) && (value < 100)) return true;
  return false;
}

function discountPrice(prezzoListino, sconto1, sconto2, sconto3)
{  
  return ((1 - sconto1/100) *((1 - sconto2 /100) *((1 - sconto3/100) * prezzoListino))).toFixed(2);    
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
    dispatch(setImgUrl(row.imgUrl));
    
  }
}

export function staleCode()
{ 
  
  return (dispatch) => {
    dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: false, isValidEan: true, EANFound: true}));
  }
}

export function processEAN(value,formValue)
{
	console.log("processEAN");
  if (isValidEAN(value))
  {
    return (dispatch) => {
   dispatch(getBookByEAN(value,formValue));  
   }
  }
else
  {
  return (dispatch) => {
     dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: true, isValidEan: false, EANFound: true}));
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
		const formValue = getState().form2.forms.rigaBolla;
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
       dispatch(actions.change('form2.rigaBolla.titolo', book.titolo));
       dispatch(actions.change('form2.rigaBolla.autore', book.autore));
       dispatch(actions.change('form2.rigaBolla.prezzoListino', book.prezzoListino));
       dispatch(actions.change('form2.rigaBolla.pezzi', "1"));
           dispatch(actions.change('form2.rigaBolla.gratis', "0"));
     
       if (!formValue.manSconto)
         { const discount = discountPrice(book.prezzoListino, formValue.sconto1, formValue.sconto2, formValue.sconto3);
           dispatch(actions.change('form2.rigaBolla.prezzoUnitario', discount));
           dispatch(actions.change('form2.rigaBolla.prezzoTotale', discount));
         }
       else 
         {
           dispatch(actions.change('form2.rigaBolla.prezzoUnitario', book.prezzoListino));
           dispatch(actions.change('form2.rigaBolla.prezzoTotale', book.prezzoListino));
         }
       dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: true, isValidEan: true, EANFound: true}));
       dispatch(actions.focus('form2.rigaBolla.pezzi'));
       }
     else  
       { 
       dispatch(actions.change('form2.rigaBolla.titolo',""));
       dispatch(actions.change('form2.rigaBolla.autore',""));
       dispatch(actions.change('form2.rigaBolla.prezzoListino', ""));
       dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: true, isValidEan: true, EANFound: false}));
       }
   }
 
}

export function changeCodeToEAN(formValues)
{   //Candidato a diventare un EAN interno
  return (dispatch) => {
    if (formValues.ean > 0 && formValues.ean.length < 12) {
    dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: true, isValidEan: false, EANFound: true}));
    dispatch(actions.change('form2.rigaBolla.ean', generateEAN(formValues.ean)));  
    dispatch(searchCatalogItem(generateEAN(formValues.ean))).then(
           (payload) => {dispatch(storeBookInfo(payload.val(),formValues));
           	             dispatch(setStatus("IDLE",""));
                         }
             )  
    }  
    else 
    {
    //Non ho l'oggetto a catalogo...si tratta di codici interni... se non ci sono non ha senso cercarli...
    dispatch(actions.setValidity('form2.rigaBolla.ean', {isValidCode: false, isValidEan: true, EANFound: true}));
    //dispatch(actions.change(form.ean.model, form.ean.value));
    }
  }  
}

export function updatePriceFromDiscount(model,value, formValues) 
{ 
   if (isPercentage(value))
  {
  var sconto1 = formValues.sconto1;
  var sconto2 = formValues.sconto2;
  var sconto3 = formValues.sconto3;
  var prezzoListino = formValues.prezzoListino;
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
    dispatch(actions.change('form2.rigaBolla.prezzoUnitario', discountPrice(prezzoListino, sconto1, sconto2, sconto3)));
    dispatch(actions.change('form2.rigaBolla.prezzoTotale', (formValues.pezzi * discountPrice(prezzoListino, sconto1, sconto2, sconto3)).toFixed(2)));
    
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
  var sconto1 = formValues.sconto1;
  var sconto2 = formValues.sconto2;
  var sconto3 = formValues.sconto3;
  var prezzoListino = value;
  
  return (dispatch) => {
     dispatch(actions.change('form2.rigaBolla.prezzoUnitario', discountPrice(prezzoListino, sconto1, sconto2, sconto3)));
   
  };
}



export function updateTotalPriceFromPrice(value, formValues)
{
 if (isNaN(value))  
    {
    return (dispatch) => {
     dispatch(actions.setValidity('form2.rigaBolla.prezzoUnitario', {isNumber: false}));
    }
    } 
  else 
    {
      return (dispatch) => {
     dispatch(actions.setValidity('form2.rigaBolla.prezzoUnitario', {isNumber: true})); 
     dispatch(actions.change('form2.rigaBolla.prezzoUnitario',value));
     dispatch(actions.change('form2.rigaBolla.prezzoTotale', (value*formValues.pezzi).toFixed(2)));
  }
 }     
}  

export function updateTotalPriceFromPezzi(value, formValues)
{
 if (!((value>=0)&&(Number.isInteger(parseFloat(value)))))  
    {
    return (dispatch) => {
    //Devo cambiare leggermente qui per non aggiornare il prezzo di listino quando sarà chiamato da un libro vero
    dispatch(actions.setValidity('form2.rigaBolla.pezzi', {isPositive: false}));
    }
    } 
  else 
    {
      return (dispatch) => {
      dispatch(actions.setValidity('form2.rigaBolla.pezzi', {isPositive: true}));
     dispatch(actions.change('form2.rigaBolla.pezzi', value));
     dispatch(actions.change('form2.rigaBolla.prezzoTotale', (value*formValues.prezzoUnitario).toFixed(2)));
  }
 }     
}  

export function toggleManSconto(value, formValues)
{return (dispatch) => {
  dispatch(actions.change('form2.rigaBolla.manSconto', value));
  if (value) 
    {
       dispatch(actions.change('form2.rigaBolla.sconto1', ""));
       dispatch(actions.change('form2.rigaBolla.sconto2', ""));
       dispatch(actions.change('form2.rigaBolla.sconto3', ""));
      dispatch(actions.change('form2.rigaBolla.prezzoUnitario', formValues.prezzoListino));
      dispatch(actions.change('form2.rigaBolla.prezzoTotale', (formValues.prezzoListino * formValues.pezzi).toFixed(2)));
    }
  else 
    {
      dispatch(actions.change('form2.rigaBolla.prezzoUnitario', formValues.prezzoListino));
      dispatch(actions.change('form2.rigaBolla.prezzoTotale', (formValues.prezzoListino * formValues.pezzi).toFixed(2)));
    }
 }
}

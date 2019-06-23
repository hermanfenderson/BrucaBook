import FormReducer from '../helpers/formReducer'
import {initialState as initialStateHelper, editedItemInitialState as editedItemInitialStateHelper} from '../helpers/form';
import {SET_ORDINIAPERTI_PER_EAN, SET_SHOW_ORDINIAPERTI_MODAL, SAVE_ORDINI_APERTI_DIFF, CHANGE_DELTA_PEZZI} from '../actions/ordiniAperti';
import {ADDED_ITEM_ORDINIAPERTI,  CHANGED_ITEM_ORDINIAPERTI, DELETED_ITEM_ORDINIAPERTI,  INITIAL_LOAD_ITEM_ORDINIAPERTI, deltaOrdiniAperti} from '../helpers/ordiniAperti';
import {isNotNegativeInteger} from '../helpers/validators';
import {calcHeader} from '../helpers/geometry';

const editedRigaOrdineValuesInitialState = 
	  {			
	};
	
const updateEanArrayErrors = (eanArray, qty) =>
	{   //Deve essere uguale a qty
		let totalePezziDelta = 0
		let errors = {hasErrors: false, eanArrayErrors: [], generalError: ""};
		for (var i=0; i< eanArray.length; i++)
			{   totalePezziDelta += parseInt(eanArray[i].pezziDelta, 10);
				if (!isNotNegativeInteger(eanArray[i].pezziDelta) || eanArray[i].pezziDelta > eanArray[i].pezzi ) 
					{
					errors.eanArrayErrors.push({hasError: true, error: '>=0'});
					if (eanArray[i].pezziDelta > eanArray[i].pezzi) 	errors.eanArrayErrors[i].error = '<= '+ eanArray[i].pezzi;
					errors.hasErrors = true;
					}
				else
					errors.eanArrayErrors.push({hasError: false, error: ''});	
			}
		//Se non ha errori... verifico che il totale torni....
		if (!errors.hasErrors)	
			{
			 if (totalePezziDelta !== qty)
				{
				errors.hasErrors = true;
				errors.generalError = "Totale da assegnare "+qty+" pezzi";
				}
			}
		return(errors);	
	}	

const editedItemInitialState = () => {
	return(editedItemInitialStateHelper(editedRigaOrdineValuesInitialState, {} ));
}

const headerParams = [{name: 'cliente', label: 'Cliente', min: 250, max: 250},
			    {name: 'dataOrdine', label: 'Data', min: 130, max:130},
			    {name: 'stato', label: 'Stato', min: 150, max: 150},
			    {name: 'pezzi', label: 'Ordinato', min: 100, max: 100},
			   {name: 'pezziDelta', label: 'Assegnato', min: 100, max: 100},
			     
			   ];

const initialState = () => {
    const eiis = editedItemInitialState();
    const extraState = {
		              eanArray: [],
		              geometry: {header: calcHeader(headerParams, 880),
		             	},
		              showOrdiniApertiModal: false,
		              eanTreeBolla: {},
		              eanTreeScontrino: {},
		              qty: 0,
		              errors: {hasErrors: false, eanArrayErrors: [], generalError: "" }
    				
    		
    							
    				}

	return initialStateHelper(eiis,extraState);
    }

const ordiniApertiR = new FormReducer('ORDINIAPERTI', null, null, null, initialState); 

export default function Ordine(state = initialState(), action) {
  var newState;
   
  switch (action.type) {
     case SET_ORDINIAPERTI_PER_EAN:
     	newState = {...state, eanArray: action.eanArray, qty: action.qty};
     	break;
     case SET_SHOW_ORDINIAPERTI_MODAL:
     	newState = {...state, showOrdiniApertiModal: action.showOrdiniApertiModal};
     	break;
     case ADDED_ITEM_ORDINIAPERTI:
  	 case CHANGED_ITEM_ORDINIAPERTI:
  	 case	DELETED_ITEM_ORDINIAPERTI:
  	 case	INITIAL_LOAD_ITEM_ORDINIAPERTI:
  	 	//Solo gli ordini fino a R
  	 	var newStateTmp;
  	 	newStateTmp = {...state, eanTreeBolla: deltaOrdiniAperti(state.eanTreeBolla, action.payload, action.type, 'R' ), eanTreeScontrino: deltaOrdiniAperti(state.eanTreeScontrino, action.payload, action.type, 'Z' )};
   	    //Recupero il default
   	    newState = ordiniApertiR.updateState(newStateTmp,action,editedItemInitialState, null, null);
        break;
   	case CHANGE_DELTA_PEZZI:
            let newEanArray = state.eanArray.slice();
            newEanArray[action.index].pezziDelta = action.value;
            let errors = updateEanArrayErrors(newEanArray, state.qty); 
           newState = {...state, eanArray: newEanArray, errors: errors};
        break;
     default:
        newState = ordiniApertiR.updateState(state,action,editedItemInitialState, null, null);
        //newState =  state;
    	break;
   
  }
 return newState;
}


export const getItems = (state) => {return state.itemsArray};  
 
export const getListeningItemOrdine = (state) => {return state.listeningItem};

export const getEanArray = (state) => {return state.eanArray};

export const getEanTreeBolla = (state) => {return state.eanTreeBolla};
export const getEanTreeScontrino = (state) => {return state.eanTreeScontrino};

export const getErrors = (state) => {return state.errors};
export const getQty = (state) => {return state.qty};
export const getShowOrdiniApertiModal = (state) => {return state.showOrdiniApertiModal};


 
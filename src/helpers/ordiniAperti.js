export const ADDED_ITEM_ORDINIAPERTI = 'ADDED_ITEM_ORDINIAPERTI';
export const CHANGED_ITEM_ORDINIAPERTI = 'CHANGED_ITEM_ORDINIAPERTI';
export const DELETED_ITEM_ORDINIAPERTI = 'DELETED_ITEM_ORDINIAPERTI';
export const INITIAL_LOAD_ITEM_ORDINIAPERTI = 'INITIAL_LOAD_ITEM_ORDINIAPERTI';

//Uso l'ordine alfabetico in status
//Passerò Z per la gestione verso le vendite e R per le cose che aspetto da magazzino
//Creo un oggetto di oggetti 
export const deltaOrdiniAperti = (eanTree, payload, type, status) => {
	switch (type)
	{
		case INITIAL_LOAD_ITEM_ORDINIAPERTI:
			{
			let values = payload.val();
				let arrayOrdiniAperti = values? Object.entries(values) : [];
		   for (const [key, value] of arrayOrdiniAperti) {
		   	     if (value.stato < status) 
				       {
				       	if (!eanTree[value.ean]) eanTree[value.ean] = {}; //Se non avevo nessun elemento per quell'EAN lo valorizzo a un empty object...
				       	eanTree[value.ean][key] = value;
				       }
				}
			}	
		break;
		case ADDED_ITEM_ORDINIAPERTI:
			{
			let value = payload.val();
			let key = payload.key;
			if (value.stato < status) 
				       {
				       	if (!eanTree[value.ean]) eanTree[value.ean] = {}; //Se non avevo nessun elemento per quell'EAN lo valorizzo a un empty object...
				       	eanTree[value.ean][key] = value;
				       }
			}
		break;
		case CHANGED_ITEM_ORDINIAPERTI:
			{
			let value = payload.val();
			let key = payload.key;
			//Se lo devo aggiungere...
			if (value.stato < status) 
				       {
				       	if (!eanTree[value.ean]) eanTree[value.ean] = {}; //Se non avevo nessun elemento per quell'EAN lo valorizzo a un empty object...
				       	eanTree[value.ean][key] = value;
				       }
			//Se lo stato non è compatibile... lo devo togliere... ammesso che ci sia...
			else if (eanTree[value.ean] && eanTree[value.ean][key]) delete eanTree[value.ean][key]; 
		
			}
		break;
		case DELETED_ITEM_ORDINIAPERTI:
			{
			let value = payload.val();
			let key = payload.key;
			if (eanTree[value.ean] && eanTree[value.ean][key]) delete eanTree[value.ean][key]; 
			if (Object.keys(eanTree[value.ean]).length === 0) delete eanTree[value.ean];
			}
		
		break;
		default:
		break;
	}
	return eanTree;
}

export const eanArray = (subEanTree) => {
	//Entries in posizione 0 ha la key e in 1 l'oggetto
	//Col metodo map genero un array fatto solo dell'oggetto con la key tra le sue proprietà
	//Col metodo sort ordino l'array 
	return(Object.entries(subEanTree).map(
			(item) => {item[1].key = item[0]; return(item[1])}).sort(
				(a,b) => {
						let order = (a.stato > b.stato) ? -1 : (a.stato < b.stato) ? 1 : 0; //In ordine decrescente di lettera....
						if (order === 0) order = a.dataOrdine - b.dataOrdine; //In ordine crescente di data ordine...
						
						if (order === 0) order = a.createdAt - b.createdAt; //In ordine crescente di tempo...
						return(order);
						})
				
				);
	
}

export const eanArrayWithDefault = (eanArray, qty) => {
	for (let elem of eanArray) {
	//I pezzi che una riga può prendersi:
	
	elem.pezziDelta = (elem.pezzi >= qty) ? qty : elem.pezzi;
	qty = qty - elem.pezziDelta;
	
  }
  //Adesso predisoongo la riga per la vendita libera...
  let rigaVenditaLibera = {pezziDelta : qty, key : 'venditaLibera' }; //23 Skidoo...a parte gli scherzi... qualsiasi numero che non sia una key valida... 
  eanArray.push(rigaVenditaLibera);
  return eanArray;
}

//Va usata solo questa
export const eanArrayFromSubEanTree = (subEanTree, qty) => {
	return(eanArrayWithDefault(eanArray(subEanTree), qty));
}
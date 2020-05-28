const fetch2 = require ('node-fetch');
const {ApolloClient} = require ('apollo-client');
const gql = require ('graphql-tag');
const { InMemoryCache } = require ('apollo-cache-inmemory');
const  { createHttpLink } = require ('apollo-link-http');




const createClient = (token,uri) => {
	
 
const client = new ApolloClient({
	link: createHttpLink({
          fetch: fetch2,
          uri: uri,
         fetchOptions: {
        	credentials: 'include',
    		},
    	headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json"
    		},
        }),
   
    cache: new InMemoryCache(),
    defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    }},
});

return client;
}


const prepareInput= (productData, location, id=null, variantId=null) =>
{   let input = {};
	if (id) input.id = id; //caso dell'update
	input.handle = productData.ean;
	input.published = true;
	input.title = productData.titolo;
	input.bodyHtml = "<b>"+productData.autore+ "</b><br>"+ productData.titolo + "<br><i>" + productData.editore + "</i><br>" ;
	input.vendor =  productData.editore;
	input.productType = "Libri";
	//console.log("sono qui: "+ channels.web)
	/*
	if (channels)
		{
		input.publications = []; //Gestione canali di vendita
		if (channels.web) input.publications.push({publicationId: channels.web});
		if (channels.pos) input.publications.push({publicationId: channels.pos});
		}
	*/
	//Se ho una immagine
	if (productData.imgFirebaseUrl)
		{
    	input.images = {};
    	input.images.src = "https://storage.googleapis.com/brucabook.appspot.com/images/books/"+productData.ean+".jpg";
		//Solo se il prodotto ha una immagine lo pubblico su facebook
		//if (channels && channels.fb) input.publications.push({publicationId: channels.fb});
			
		}
	console.log("qui:" + variantId);
	input.variants = {};
	if (variantId) input.variants.id = variantId;
	input.variants.sku = productData.ean;
	input.variants.barcode = productData.ean;
	
	input.variants.price = productData.prezzoListino;
	input.variants.inventoryItem = {tracked: true};
	input.variants.inventoryPolicy = "CONTINUE";
	input.variants.inventoryManagement = "SHOPIFY";
	input.variants.inventoryQuantities = {};
	input.variants.inventoryQuantities.locationId = location;
	input.variants.inventoryQuantities.availableQuantity = productData.pezzi;
	input.variants.requiresShipping = true;
	
	

	
	return input;
}

//Ritorna una promise che viene gestita dal chiamante per ottenere i dati
const getProductId = (client,ean) => {
	const PRODUCT_BY_HANDLE = gql`
	query productByHandle($ean: String!)
{productByHandle(handle: $ean) {
  id, variants (first:1) {
      edges {
        node {
          id
        }
      }
   }
 }	
}
`

return(client.query({ query: PRODUCT_BY_HANDLE, variables: {ean: ean} }))
}

const updateProduct = (client, productData, location, id, variantId) =>
{
	const UPDATE_PRODUCT = gql`
	mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
    }
    
    userErrors {
      field
      message
    }
  }
}
`
console.log("qua qua " + variantId);
let input = prepareInput(productData,location, id, variantId);
console.log(input);
return(client.mutate({ mutation: UPDATE_PRODUCT, variables: {input: input} }))

}

const createProduct = (client, productData, location) =>
{
	const CREATE_PRODUCT = gql`
		mutation productCreate($input: ProductInput!) {
  productCreate(input: $input) {
    product {
      id
    }
    
    userErrors {
      field
      message
    }
  }
}
`
let input = prepareInput(productData,location);
return(client.mutate({ mutation: CREATE_PRODUCT, variables: {input: input} }))

}

module.exports = {
createClient: createClient,
getProductId: getProductId,
updateProduct: updateProduct,
createProduct: createProduct
}
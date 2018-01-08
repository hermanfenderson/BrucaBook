export const LOAD_README = 'LOAD_README';
export const README_LOADED = 'README_LOADED';

export const loadReadme = () =>

{
		return function(dispatch,getState) 
		{
	   	  dispatch ({type: LOAD_README});
	   	  const readmePath = require("../scenes/readmeViewer/README.md");
		  fetch(readmePath)
    		.then(response => {
    	    return response.text()
    		})
    		.then(text => {dispatch({
    			type: README_LOADED,
    			readme: text
    					})
    				 })
	   }
	
}
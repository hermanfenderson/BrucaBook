export const LOAD_README = 'LOAD_README';
export const README_LOADED = 'README_LOADED';
export const SET_SHOW_MODAL = 'SET_SHOW_MODAL';

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

export const setShowModal = (showModal) =>
  { return({type: SET_SHOW_MODAL, showModal: showModal});
  }  
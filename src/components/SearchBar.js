import React from 'react';

const SearchBar = (props) =>  {
  const onInputChange = (term) => {
    props.onTermChange(term);
  }
  
    return (
      <div className="search">
        <input placeholder="Enter text to search for gifs!" onChange={event => onInputChange(event.target.value)} />
      </div>
    );
 }

export default SearchBar;

import React from 'react';
import Header from '../containers/Header';

const App = (props) => {
    return (
      <div>
        <Header />
        {props.children}
      </div>
    );
}

export default App;

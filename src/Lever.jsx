import React, { useEffect, useState } from 'react'
import './App.css'

const Lever = (props) => {

    const setWorkType = props.setWorkType;

    return(
        <div className='main'>
            <header className = 'Header'> 
                <button onClick={() => setWorkType(1)}>change to graphic</button>
            </header>
        <div className='menu'>
            
        </div>
        <div className = 'decart'>

        </div>
    </div>
    );
}

export default Lever;
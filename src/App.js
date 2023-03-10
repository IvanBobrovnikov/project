import React, { useEffect, useState } from 'react'
import Graphic from './Griphic'
import './App.css'
import Lever from './Lever'

function App() {

  const [workType, setWorkType] = useState(1);
  const [renderGraf, setRenderGraf] = useState(true);
  const [renderRech, setRenderRech] = useState(false);

  useEffect(() => {
    setRenderGraf(false); setRenderRech(false);
    if(workType === 1) setRenderGraf(true);
    if(workType === 2) setRenderRech(true);
  }, [workType])

  return(
    <>
      {renderGraf? <Graphic setWorkType = {setWorkType}/> : null}
      {renderRech? <Lever setWorkType = {setWorkType}/> : null}
    </>
  );
}

export default App;
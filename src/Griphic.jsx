import React, { useEffect, useState } from 'react'
import Decart from './components/Decart'
import MenuElement from './components/MenuElement';
import AnchoreMenu from './components/AnchoreMenu';
import restart from './img/restart.png'
import pause from './img/pause.png'
import start from './img/start.png'
import './App.css'

const Graphic = (props) =>{
    
  const delta_time = 0.025;

  const setWorkType = props.setWorkType;

  const decart_width = document.documentElement.clientWidth - 300;
  const decart_height = document.documentElement.clientHeight - 60;

  const [objects, set_objects] = useState([]);
  const [next_id, set_next_id] = useState(0);
  const [anchors, set_anchores] = useState([]);
  const [nextAnchoreId, setNewId] = useState(0);
  const [is_placing_anchore, set_is_placing_anchore] = useState(false);

  const [time, set_time] = useState(0);
  const [is_paused, set_is_paused] = useState(true);

  const [is_placing, set_is_placing] = useState(false);

  const [DisplayOnSelected, setDisplayOnSelected] = useState({topPoint: true, sidePoint: true, everyPoint: true})

  useEffect(() => {
    const interval = setInterval(() => {
      if(!is_paused) set_time(superRound(time + delta_time, 100));
    }, 1000*delta_time)

    return () => {
      clearInterval(interval)
    }
  })


  const start_timer = () => {
    set_is_paused(false);
  }
  
  const stop_timer = () => {
    if(is_paused) return;
    set_is_paused(true);
  }

  const reset_timer = () => {
    set_time(0);
    set_is_paused(true);
  }

  const handle_placing = () => {
    if(is_placing) set_is_placing(false);
    else set_is_placing(true);
  }

  const stop_placing = () => {
    set_is_placing(false);
  }

  const superRound = (number, sumbols) => {
    return Math.round(number * sumbols) / sumbols;
  }

  const add_new_object = (x, y, speedX, speedY, acsX, acsY) => {
    let text = [`Z = ( ${superRound(x, 100)} ; ${superRound(y, 100)} )`,
           `Vx = ${superRound(speedX, 100)} Vy = ${superRound(speedY, 100)} `, 
           `Ax = ${superRound(acsX, 100)} Ay = ${superRound(acsY, 100)}`]
    set_objects([].concat(objects, [{id: next_id, name: 'Z', x: x, y: y, speedX: speedX, speedY: speedY, V: 'no', acsX: acsX, acs: 'no', acsY: acsY, isGravity: false, color: '#000000', is_selected: false, anchore: 'no', text: text}]));
    set_next_id(next_id+1);
  }

  const new_selected = (number, ancherID) => {
    let newObjects = []
    for(let i = 0; i < objects.length; i++){
      let obj = objects[i];
      if(number === obj.id) {
      obj.is_selected = !obj.is_selected;
      if(ancherID !== -1) obj.anchore = ancherID;}
      newObjects.push(obj);
    }
    set_objects(newObjects);
  }

  const change_objects = (value, property, id) => {
    let newObjects = [];
    for(let i = 0; i < objects.length; i++){
      let obj = objects[i]
      if(id === obj.id){
        obj.selected = true
        obj[property] = value
      } else {
        obj.selected = false;
      }
      newObjects.push(obj)
    }
    set_objects(newObjects);
  }

  const place_anchore = () => {
    if(is_placing_anchore) set_is_placing_anchore(false);
    else set_is_placing_anchore(true);
  }

  const stop_placing_anchore = () => {
    set_is_placing_anchore(false);
  }

  const add_anchore = (x, y) => {
    set_anchores([].concat(anchors, [{id: nextAnchoreId, name:'M', x: x, y: y, selected: false, text: `M = ( ${superRound(x, 100)} : ${superRound(y, 100)} )`}]));
    setNewId(nextAnchoreId + 1);
  }

  const change_anchore = (value, property, id) => {
    let newAnchores = [];
    for(let i = 0; i < anchors.length; i++){
      let anch = anchors[i]
      if(id === anch.id){
        anch[property] = value;
      }
      newAnchores.push(anch)
    }
    set_anchores(newAnchores);
  }

  const delete_anchore = (id) => {
    const newAnch = [];
    for(let i = 0; i < anchors.length; i++){
      if(anchors[i].id !== id) newAnch.push(anchors[i]);
    }
    set_anchores(newAnch);
  }

  const select_anchore = (anchoreID) => {
    let newAnchores = [];
    for(let i = 0; i < anchors.length; i++){
      let selected = false;
      if(anchors[i].id === anchoreID) selected = true;
      newAnchores.push({id: anchors[i].id, name: anchors[i].name, x: anchors[i].x, y: anchors[i].y, is_selected: selected, text: anchors[i].text});
    }
    set_anchores(newAnchores);
  }

  const list_objects = objects.map((object) => 
    <div key = {object.id}>
      <MenuElement object = {object} change_objects = {change_objects} objects = {objects} set_objects = {set_objects}/>
    </div>
  );

  const anchoreMenu = anchors.map((anchore) => 
    <div key = {anchore.id}>
      <AnchoreMenu anchore = {anchore} change_anchore = {change_anchore} delete_anchore = {delete_anchore}/>
    </div>
  );

  return(
    <div className='main'>
      <header className = 'Header'> 
        <button onClick={() => handle_placing()}>place object</button>
        <button onClick={() => place_anchore()}>place anchore</button>
        <div className='time' fontSize = '80px'>{`Time: ${superRound(time, 100)}`}</div>
        <img className = 'button_3' onClick={() => reset_timer()} src = {restart} alt = "restart" width='41px' height='41px' />
        <img className = 'button_2' onClick={() => stop_timer()}  src = {pause} alt = "pause" width='38px' height='38px'/>
        <img className = 'button_1' onClick={() => start_timer()} src = {start} alt = "start" width='41px' height='41px'/>
      </header>
      <div className='menu'>
        <div>{list_objects}</div>
      </div>
      <div className = 'decart'>
        <Decart width={decart_width} height={decart_height} 
        objects = {objects}
        time = {time} is_placing = {is_placing}
        add_new_object = {add_new_object} stop_placing = {stop_placing}
        new_selected = {new_selected}
        anchors = {anchors}
        is_placing_anchore = {is_placing_anchore} stop_placing_anchore = {stop_placing_anchore} add_anchore = {add_anchore}
        select_anchore = {select_anchore}
        change_objects = {change_objects}
        DisplayOnSelected = {DisplayOnSelected}
        />
        <div>{anchoreMenu}</div>
      </div>
    </div>
  );
}

export default Graphic;


//<button onClick={() => setWorkType(2)}>change to lever</button>
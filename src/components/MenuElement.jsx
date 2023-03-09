import React, { useEffect, useState } from 'react'
import { HexColorPicker } from "react-colorful";
import './menuElement_styles.css'

const MenuElement = (props) =>{

    const object = props.object;
    const change_objects = props.change_objects;
    const objects = props.objects;
    const set_objects = props.set_objects;

    const [color, setColor] = useState(object.color);
    const [changingColor, setCangingColor] = useState(false);

    useEffect(() => {
        change_objects(color, 'color', object.id);
    }, [color])

    const handleChange = (value, number, id) => {
        let object = {};
        for(let i = 0; i < objects.length; i++){
          if(objects[i].id === id){ object = objects[i]; break;}
        }
        let text = object.text;
        text[number] = value;
        change_objects(text, 'text', id);
        value = value.replace(';', ' ');
        let words = value.split(' ');
        if(number === 0){
          let name = words[0];
          let x = words[3];
          let y = words[6];
          change_objects(name, 'name', id);
          change_objects(x, 'x', id);
          change_objects(y, 'y', id);
        }else if(number === 1){
          let vx = words[2];
          let vy = words[5];
          change_objects(vx, 'speedX', id);
          change_objects(vy, 'speedY', id);
        }else{
          let vx = words[2];
          let vy = words[5];
          change_objects(vx, 'acsX', id);
          change_objects(vy, 'acsY', id);
        }
    }

    const delete_object = (id) =>{
        let newObjects = []
        for(let i = 0; i < objects.length; i++){
          if(objects[i].id !== id) newObjects.push(objects[i]);
        }
        set_objects(newObjects);
      }

    return(
        <div className='object_menu'>
            <input style={{width: '96%', height: '23%'}} type="text" value={object.text[0]} onChange = {(event) => handleChange(event.target.value, 0, object.id)}/>
            <input style={{width: '96%', height: '23%'}} type="text" value={object.text[1]} onChange = {(event) => handleChange(event.target.value, 1, object.id)}/>
            <input style={{width: '96%', height: '23%'}} type="text" value={object.text[2]} onChange = {(event) => handleChange(event.target.value, 2, object.id)}/>
            <button onClick = { () => delete_object(object.id)}>{'delete'}</button>
            <button onClick = { () => {if(changingColor) setCangingColor(false); else setCangingColor(true)}} 
            style = {{}}>{!changingColor? 'color' : 'close'}</button>
            {changingColor? <HexColorPicker color={color} onChange = {setColor}
            style = {{width: '99%', position: 'absolute' }}/> : null}
            <button onClick={() => {
                if(object.isGravity) change_objects(false, 'isGravity', object.id);
                else change_objects(true, 'isGravity', object.id);
            }}>Gravity: {object.isGravity? 'on' : 'off'}</button>
        </div>
    )

}

export default MenuElement;
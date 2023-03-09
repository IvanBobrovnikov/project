import React, { useState } from 'react'
import './AnchoreMenuStyle.css' 

const AnchoreMenu = (props) => {

    const anchore = props.anchore;
    const change_anchore = props.change_anchore;
    const delete_anchore = props.delete_anchore;

    const handleChange = (value, id) => {
        let text = value.split(' ');
        let name = text[0];
        let x = text[3];
        let y = text[5];
        change_anchore(name, 'name', id);
        change_anchore(x, 'x', id);
        change_anchore(y, 'y', id);
        change_anchore(value, 'text', id);
    }

    return(
        <>
        {anchore.is_selected? 
        <div className = 'mene'>
            <input type="text" value = {anchore.text} onChange = {(e) => handleChange(e.target.value, anchore.id)} style = {{width: '90%'}}/>
            <button onClick={() => {delete_anchore(anchore.id)}}>delete</button>
        </div>
        : null}

        </>
    )

}

export default AnchoreMenu;
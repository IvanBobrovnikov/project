import React, { useRef, useEffect, useState } from 'react'

const Decart = (props) => {

  const change_objects = props.change_objects;

  const anchors = props.anchors;

  const [selecting, set_selecting] = useState(false);
  const [connector, set_connector] = useState(-1);

  const [newObject_x, set_newObject_x] = useState(-10);
  const [newObject_y, set_newObject_y] = useState(-10);
  const [newObject_speedX, set_newObject_speedX] = useState(0);
  const [newObject_speedY, set_newObject_speedY] = useState(0);

  const [place, set_place] = useState({x: -10, y: -10});
  const [dot_placed, set_dotplaced] = useState(false);
  const [speed_placed, set_speedplaced] = useState(false);

  const time =  props.time;

  const [isChange, setIsChange] = useState(false);
  const [prev_x, set_x] = useState(0);
  const [prev_y, set_y] = useState(0);

  const height = props.height;
  const width = props.width;

  const objects = props.objects;
    
  const [startX, set_startX] = useState(Math.round(width/2));
  const [startY, set_startY] = useState(Math.round(height/2));

  const [scaleX, change_scaleX] = useState(90);
  const [scaleY, change_scaleY] = useState(90);

  const [scaleCof, set_scaleCof] = useState(1);
  const [numberCof, set_numberCof] = useState(1);
  
  const canvasRef = useRef(null);

  const [mousePos, setMousePos] = useState({});
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX - 300, y: event.clientY - 50});
    };
    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.font = `${Math.round(scaleX / 6 / (scaleCof - Math.floor(scaleCof) + 1))}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const shiftNumbers = 3;
    //рисуем систему координат
    const decart = () => {
      ctx.clearRect(0, 0, width, height);
      //проведение осей системы координат
      ctx.beginPath();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.1;
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, height);
      ctx.moveTo(0, startY);
      ctx.lineTo(width, startY);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.lineWidth = 0.4;
      ctx.strokeStyle = 'aaaaaa';
      for(let i = startY; i > 0; i -= scaleY ){
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        if(startX < 0) ctx.fillText((startY - i) / scaleY / numberCof, 5, i + shiftNumbers);
        else if(startX > width - 20) ctx.fillText((startY - i) / scaleY / numberCof, width - 20, i + shiftNumbers);
        else ctx.fillText((startY - i) / scaleY / numberCof, startX, i + shiftNumbers);
      }
      for(let i = startY; i < height; i += scaleY ){
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);

        if(startX < 0) ctx.fillText((startY - i) / scaleY / numberCof, 5, i + shiftNumbers);
        else if(startX > width - 20) ctx.fillText((startY - i) / scaleY / numberCof, width - 20, i + shiftNumbers);
        else ctx.fillText((startY - i) / scaleY / numberCof, startX, i + shiftNumbers);
      }
      for(let i = startX; i > 0; i -= scaleX ){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);

        if(startY < 0) ctx.fillText((i - startX) / scaleX / numberCof, i, 5);
        else if(startY > height - 15) ctx.fillText((i - startX) / scaleX / numberCof, i, height - 15);
        else ctx.fillText((i - startX) / scaleX / numberCof, i, startY + shiftNumbers);
      }
      for(let i = startX; i < width; i += scaleX ){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);

        if(startY < 0) ctx.fillText((i - startX) / scaleX / numberCof, i, 5);
        else if(startY > height - 15) ctx.fillText((i - startX) / scaleX / numberCof, i, height - 15);
        else ctx.fillText((i - startX) / scaleX / numberCof, i, startY + shiftNumbers);
      }
      ctx.stroke();
      ctx.closePath();
      //--------------------------------------------
      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = 'aaaaaa';
      for(let i = startY; i > 0; i -= scaleY/5 ){
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
      }
      for(let i = startY; i < height; i += scaleY/5 ){
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
      }
      for(let i = startX; i > 0; i -= scaleX/5 ){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      for(let i = startX; i < width; i += scaleX/5 ){
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      ctx.stroke();
      ctx.closePath();
    }
    //рисуем графики
    const drawing_tragectory = () => {
      for(let i = 0; i < objects.length ; i++){
        if(objects[i].anchore === 'no'){
          const tolshina = 1;
          let times = 1;
          let start_x =  scaleX * numberCof * objects[i].x;
          let start_y = scaleX * numberCof * objects[i].y;
          let speedX = scaleX * numberCof * objects[i].speedX;
          let speedY = scaleX * numberCof * objects[i].speedY;
          let acsX = scaleX * numberCof * objects[i].acsX, acsY;
          if(objects[i].isGravity) acsY = scaleX * numberCof * (objects[i].acsY - 10);
          else acsY = scaleX * numberCof * objects[i].acsY;

          ctx.fillStyle = objects[i].color;
          for(let x = -startX; x <= -startX + width; x += times){
            let t1 = -1, t2 = -1;
            if(acsX !== 0){
              t1 = (-speedX + Math.pow(( speedX*speedX - 2 * acsX * (start_x - x) ), 0.5))/acsX;
              t2 = (-speedX - Math.pow(( speedX*speedX - 2 * acsX * (start_x - x) ), 0.5))/acsX;
            }else{
              t1 = (x - start_x)/speedX;
            }
            let y_1, y_2;
            if (t1 >= 0) y_1 = start_y + speedY * t1 + acsY * t1*t1 / 2;
            if (t2 >= 0) y_2 = start_y + speedY * t2 + acsY * t2*t2 / 2;
            let X = x + startX
            let Y1 = startY - y_1;
            let Y2 = startY - y_2;
            ctx.fillRect(X, Y1, tolshina, tolshina);
            ctx.fillRect(X, Y2, tolshina, tolshina);
          }
          for(let y = startY - height; y <= startY + width; y += times){
            let t1 = -1, t2 = -1;
            if(acsY !== 0){
              t1 = (-speedY + Math.pow(( speedY*speedY - 2 * acsY * (start_y - y) ), 0.5))/acsY;
              t2 = (-speedY - Math.pow(( speedY*speedY - 2 * acsY * (start_y - y) ), 0.5))/acsY;
            }else{
              t1 = (y - start_y)/speedY;
            }
            let x_1, x_2;
            if (t1 >= 0) x_1 = start_x + speedX * t1 + acsX * t1*t1 / 2;
            if (t2 >= 0) x_2 = start_x + speedX * t2 + acsX * t2*t2 / 2;
            let Y = startY - y;
            let X1 = startX + x_1;
            let X2 = startX + x_2;
            ctx.fillRect(X1, Y, tolshina, tolshina);
            ctx.fillRect(X2, Y, tolshina, tolshina);
          }
          if(objects[i].is_selected){
            let acs = objects[i].acsY;
            if(objects[i].isGravity) acs -= 10;
            let t = -objects[i].speedY/acs;
            if(t < 0) continue;
            let x = startX + (start_x + speedX * t + acsX * t * t / 2);
            let y = startY - (start_y + speedY * t + acsY * t * t / 2);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2*Math.PI, false);
            ctx.fill();
            const superRound = (num) => {
              return Math.round(num * 100) / 100
            } 
            ctx.fillText(`(${superRound((x - startX) / numberCof / scaleX)}; ${superRound((startY - y) / numberCof / scaleX)})`, x + 10, y - 10);
          }
          ctx.fillStyle = '#000000';
        }else if(objects[i].isGravity === false){
          let anchoreId = objects[i].anchore;
          let anchore = 0;
          for(let g = 0; g < anchors.length; g++){
            if(anchors[g].id === anchoreId){
              anchore = anchors[g]; break;
            }
          }
          if(anchore === 0) {change_objects('no', 'anchore', objects[i].id); continue;}
          let radius = Math.pow(( Math.pow((anchore.x - objects[i].x), 2) + Math.pow((anchore.y - objects[i].y), 2) ), 0.5);
          radius = radius * numberCof * scaleX;
          let x = anchore.x * numberCof * scaleX + startX;
          let y = startY - anchore.y * numberCof * scaleY;
          ctx.beginPath();
          ctx.strokeStyle = objects[i].color;
          ctx.lineWidth = 0.7;
          ctx.arc(x, y, radius, 0, 2*Math.PI, false);
          ctx.stroke();
          ctx.closePath();
        }else if(objects[i].isGravity === true){
          let anchoreId = objects[i].anchore;
          let anchore = 0;
          for(let g = 0; g < anchors.length; g++){
            if(anchors[g].id === anchoreId){
              anchore = anchors[g]; break;
            }
          }
          if(anchore === {}) {change_objects('no', 'anchore', objects[i].id); continue;}
          let x = anchore.x * numberCof * scaleX + startX;
          let y = startY - anchore.y * numberCof * scaleY;
          let radius = Math.pow(( Math.pow((anchore.x - objects[i].x), 2) + Math.pow((anchore.y - objects[i].y), 2) ), 0.5);
          let aY = objects[i].y - anchore.y;
          let fi = Math.acos(aY / radius);
          radius = radius * numberCof * scaleX;
          let objx = startX + objects[i].x * numberCof * scaleX;
          let objy = startY - objects[i].y * numberCof * scaleX;
          ctx.beginPath();
          ctx.strokeStyle = objects[i].color;
          ctx.lineWidth = 0.7;
          ctx.arc(x, y, radius, fi - Math.PI/2, -fi - Math.PI/2, false);
          //ctx.lineTo( , objy);
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.strokeStyle = objects[i].color;
          ctx.lineWidth = 0.3;
          ctx.moveTo(objx, objy);
          ctx.lineTo(x, y);
          ctx.lineTo(2*x - objx, objy);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    //рисуем тела 
    const draw_objects = () => {
      for(let i = 0; i < objects.length; i++){
        let x, y;
        if(objects[i].anchore === 'no'){
          let start_x = objects[i].x;
          let start_y = objects[i].y;
          let speedX = objects[i].speedX;
          let speedY = objects[i].speedY;
          let acsX = objects[i].acsX;
          let acsY = objects[i].acsY;
          if(objects[i].isGravity) acsY -= 10;
          x = start_x + speedX * time + acsX * time*time / 2;
          y = start_y + speedY * time + acsY * time*time / 2;
        }else if(objects[i].isGravity === false){
          let anchoreId = objects[i].anchore;
          let anchore = 0;
          for(let g = 0; g < anchors.length; g++){
            if(anchors[g].id === anchoreId){
              anchore = anchors[g]; 
              break;
            }
          }
          if(anchore === 0) {change_objects('no', 'anchore', objects[i].id); continue;}
          let aY = objects[i].y - anchore.y;
          let radius = Math.pow(( Math.pow((anchore.x - objects[i].x), 2) + Math.pow((anchore.y - objects[i].y), 2) ), 0.5);
          let fi = Math.acos(aY / radius);
          if(objects[i].x < anchore.x) fi = -fi;
          if(objects[i].V === 'no'){
            let aX = objects[i].x - anchore.x;
            let bX = objects[i].speedX;
            let bY = objects[i].speedY;
            let cX = objects[i].acsX;
            let cY = objects[i].acsY;
            let cosA = ((aX * bX) + (aY * bY))/( Math.pow((aX*aX+aY*aY), 0.5) * Math.pow((bX*bX+bY*bY), 0.5) );
            let sinA = Math.pow((1 - Math.pow(cosA, 2)), 0.5);
            const znak = (aX, aY, bX, bY) => {
              let cof = 1;
              if(aX > 0 && aY > 0) if(bY >= (aY/aX) * bX) cof = -1;
              if(aX < 0 && aY > 0) if(bY < (aY/aX) * bX) cof = -1;
              if(aX < 0 && aY < 0) if(bY <= (aY/aX) * bX) cof = -1;
              if(aX > 0 && aY < 0) if(bY > (aY/aX) * bX) cof = -1;
              return cof;
            }
            let speed;
            if((bX === 0) && (bY === 0)) speed = 0;
            else speed = Math.pow(( bX*bX + bY*bY ), 0.5) * sinA * znak(aX, aY, bX, bY);

            let cosB = ((aX * cX) + (aY * cY))/( Math.pow((aX*aX+aY*aY), 0.5) * Math.pow((cX*cX+cY*cY), 0.5) );
            let sinB = Math.pow((1 - Math.pow(cosB, 2)), 0.5);
            let acs;
            if((cX === 0) && (cY === 0)) acs = 0;
            else acs = Math.pow(( cX*cX + cY*cY ), 0.5) * sinB * znak(aX, aY, cX, cY);
            change_objects(speed, 'V', objects[i].id);
            change_objects(acs, 'acs', objects[i].id);
          }
          let speed = objects[i].V;
          let acs = objects[i].acs;
          let angle = ((time * speed + time*time * acs / 2)/(radius)) % (2*Math.PI);
          let alfa = fi+angle;
          x = radius * Math.sin(alfa) + anchore.x;
          y = radius * Math.cos(alfa) + anchore.y;
          ctx.beginPath();
          ctx.strokeStyle = objects[i].color;
          ctx.lineWidth = 0.8;
          ctx.moveTo(startX + anchore.x * numberCof * scaleX, startY - anchore.y * numberCof * scaleY);
          ctx.lineTo(startX + scaleX * numberCof * x, startY - numberCof * scaleX * y);
          ctx.stroke();
          ctx.closePath();
        }else if(objects[i].isGravity === true){
          let anchoreId = objects[i].anchore;
          let anchore = 0;
          for(let g = 0; g < anchors.length; g++){
            if(anchors[g].id === anchoreId){
              anchore = anchors[g]; 
              break;
            }
          }
          if(anchore === 0) {change_objects('no', 'anchore', objects[i].id); continue;}
          let aaY = objects[i].y - anchore.y;
          let ax = anchore.x, ay = anchore.y;
          let objx = objects[i].x, objy = objects[i].y;
          let radius = Math.pow(( Math.pow((ax - objx), 2) + Math.pow((ay - objy), 2) ), 0.5);
          let fi = Math.PI - Math.acos(aaY / radius);
          if(objects[i].x > anchore.x) fi = -fi;
          let coord = radius*Math.sin(fi) * Math.cos( Math.pow((9.8 / radius), 0.5) * time);
          x = anchore.x - coord;
          y = anchore.y - Math.pow( ( radius*radius - coord*coord ) , 0.5);
          ctx.beginPath();
          ctx.strokeStyle = objects[i].color;
          ctx.lineWidth = 0.8;
          ctx.moveTo(startX + anchore.x * numberCof * scaleX, startY - anchore.y * numberCof * scaleY);
          ctx.lineTo(startX + numberCof * scaleX * x, startY - numberCof * scaleX * y);
          ctx.stroke();
          ctx.closePath();
        }
        if(selecting) select_object(mousePos.x, mousePos.y, startX + numberCof * scaleX * x, startY - numberCof * scaleX * y, objects[i].id);
        if(!(startX + numberCof * scaleX * x < -10 || startX + numberCof * scaleX * x > width + 10 || 
          startY - numberCof * scaleX * y < -10 || startY - numberCof * scaleX * y > height + 10)){
          ctx.beginPath();
          ctx.fillStyle = objects[i].color;
          ctx.arc(startX + scaleX * numberCof * x, startY - scaleX * numberCof * y, 7, 0, 2*Math.PI, false);
          ctx.fill();
          if(objects[i].is_selected){
            ctx.beginPath();
            ctx.arc(startX + scaleX * numberCof * x, startY - scaleX * numberCof * y, 12, 0, 2*Math.PI, false);
            ctx.strokeStyle = objects[i].color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.fillStyle = '#000000';
          ctx.fillText(objects[i].name, startX + numberCof * scaleX * x + 3*shiftNumbers, startY - numberCof * scaleX * y);
        }
      }
    }
    decart();
    drawing_tragectory();
    draw_objects();
    const draw_orrow = () => {
      ctx.beginPath();
      ctx.arc(place.x, place.y, 7, 0, 2*Math.PI, false);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(place.x, place.y, 7, 0, 2*Math.PI, false);
      ctx.fillStyle = '#000000';
      ctx.fill();
      if(dot_placed){
        drawArrow(ctx, place.x, place.y, mousePos.x, mousePos.y, 2, 'black');
        if(!speed_placed) ctx.fillText('V', mousePos.x + shiftNumbers, mousePos.y + shiftNumbers);
        else {
          let speedXPos = place.x + newObject_speedX * numberCof * scaleX;
          let speedYPos = place.y - newObject_speedY * numberCof * scaleX;
          drawArrow(ctx, place.x, place.y, speedXPos, speedYPos, 2, 'black');
          ctx.fillText('V', speedXPos + shiftNumbers, speedYPos + shiftNumbers);
          ctx.fillText('Acs', mousePos.x + shiftNumbers, mousePos.y + shiftNumbers);
        }
      }
    }
    draw_orrow();
    const draw_anchores = () => {
      for(let i = 0; i < anchors.length; i++){
        let X = anchors[i].x * numberCof * scaleX + startX;
        let Y = startY - anchors[i].y * numberCof * scaleY;
        ctx.fillRect(X - 4, Y - 4, 8, 8);
        ctx.fillText(anchors[i].name, X + 5, Y + 5);
        if(anchors[i].is_selected){
          ctx.lineWidth = 1.5;
          ctx.strokeRect(X - 7, Y - 7, 14, 14);
          ctx.beginPath();
          ctx.moveTo(X, Y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.lineWidth=0.8;
          ctx.strokeStyle = 'black';
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    draw_anchores();
  });

  const scaleChange = (delta) => {
    if(dot_placed) return;
    const scaleCgangeValue = 10 * -Math.round(delta / 125);
    set_scaleCof(scaleCof + scaleCgangeValue/scaleX);
    change_scaleX(Math.round(90 * (scaleCof - Math.floor(scaleCof) + 1)));
    change_scaleY(Math.round(90 * (scaleCof - Math.floor(scaleCof) + 1)));
    set_numberCof(Math.pow(2, Math.floor(scaleCof) - 1));
  }

  const startChange = (x, y) => {
    setIsChange(true);
    set_x(x);
    set_y(y);
  }

  const startMove = (x, y) => {
    if(!isChange) return;
    if(props.is_placing) return;
    set_startX(startX + (x - prev_x));
    set_startY(startY + (y - prev_y));
    set_x(x);
    set_y(y);
  }

  function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = color;
 
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();
 
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    ctx.stroke();
    ctx.restore();
  }

  const place_object = (x, y) => {
    set_dotplaced(true);

    set_place({x: x, y: y});
    let X = (x - startX) / numberCof / scaleX;
    let Y = (startY - y) / numberCof / scaleY;
    set_newObject_x(X);
    set_newObject_y(Y);
    //props.add_new_object(X, Y);
  }

  const place_speed = (x, y) => {
    let X = x - place.x;
    let Y = y - place.y;
    set_newObject_speedX(X / numberCof / scaleX);
    set_newObject_speedY(-(Y / numberCof / scaleY));
    set_speedplaced(true);
  }

  const place_acs = (x, y) => {
    let acsX = (x - place.x) / numberCof / scaleX;
    let acsY = (place.y - y) / numberCof / scaleY;
    props.add_new_object(newObject_x, newObject_y, newObject_speedX, newObject_speedY, acsX, acsY);
    set_dotplaced(false);
    set_speedplaced(false);
    props.stop_placing();
    set_newObject_x(-10);
    set_newObject_y(-10);
    set_newObject_speedX(0);
    set_newObject_speedY(0);
    set_place({x: -10, y: -10});
  }

  const select_object = (mouseX, mouseY, x, y, i) => {
    if(((x > mouseX - 10) && (x < mouseX + 10)) && ((y > mouseY - 10) && (y < mouseY + 10))){
      props.new_selected(i, connector);
    }
    set_selecting(false);
  }
  
  const place_anchore = (x, y) => {
    let X = (x - startX) / numberCof / scaleX;
    let Y = (startY - y) / numberCof / scaleY;
    props.add_anchore(X, Y);
    props.stop_placing_anchore();
  }

  const select_anchore = (x, y) => {
    for(let i = 0; i < anchors.length; i++){
      let X = startX + anchors[i].x * numberCof * scaleX;
      let Y = startY - anchors[i].y * numberCof * scaleX;
      if(((x > X - 10) && (x < X + 10)) && ((y > Y - 10) && (y < Y + 10))) {
        if(anchors[i].is_selected === false) {props.select_anchore(anchors[i].id); set_connector(anchors[i].id);}
        else {props.select_anchore(-1); set_connector(-1);}
        break;
      }
    }
  }

  return (
    <>
    <canvas width={width} height={height} ref={canvasRef}
    onWheel = {(e) => {scaleChange(e.deltaY);}}
    onMouseDown = {(e) => startChange(e.clientX, e.clientY)}
    onMouseMove = {(e) => startMove(e.clientX, e.clientY)}
    onMouseUp = {() => setIsChange(false)}
    onClick = {(e) => {
      select_anchore(e.pageX - 300, e.pageY - 50);
      set_selecting(true);
      if(props.is_placing){
        if(!dot_placed) return place_object(e.pageX - 300, e.pageY - 50);
        if(dot_placed && !speed_placed) return place_speed(e.pageX - 300, e.pageY - 50);
        place_acs(e.pageX - 300, e.pageY - 50);
      }
      if(props.is_placing_anchore) place_anchore(e.pageX - 300, e.pageY - 50);
    }}
    />
    </>
  )
}

export default Decart;
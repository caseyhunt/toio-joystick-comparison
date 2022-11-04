var speed1 = 0x64;
var speed2 = 0x64;

const CUBE_ID_ARRAY = [ 0, 1];
const SUPPORT_CUBE_NUM = CUBE_ID_ARRAY.length;

// Global Variables.
const gCubes = [ undefined, undefined, undefined ];





  const SERVICE_UUID              = '10b20100-5b3b-4571-9508-cf3efcd7bbae';
  const MOVE_CHARCTERISTICS_UUID = '10b20102-5b3b-4571-9508-cf3efcd7bbae';
  const SOUND_CHARCTERISTICS_UUID = '10b20104-5b3b-4571-9508-cf3efcd7bbae';
  const LIGHT_CHARCTERISTICS_UUID = '10b20103-5b3b-4571-9508-cf3efcd7bbae';
  const POSITION_CHARACTERISTICS_UUID = '10b20101-5b3b-4571-9508-cf3efcd7bbae';


  const connectNewCube = () => {
      const cube = {
          device:undefined,
          sever:undefined,
          service:undefined,
          soundChar:undefined,
          moveChar:undefined,
          lightChar:undefined,
          posChar: undefined

      };

      // Scan only toio Core Cubes
      const options = {
          filters: [
              { services: [ SERVICE_UUID ] },
          ],
      }

      navigator.bluetooth.requestDevice( options ).then( device => {
          cube.device = device;
          if( cube === gCubes[0] ){
              const cubeID = 1;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }else if( cube === gCubes[1] ){
              const cubeID = 2;
              changeConnectCubeButtonStatus( cubeID, undefined, true );
          }
          return device.gatt.connect();
      }).then( server => {
          cube.server = server;
          return server.getPrimaryService( SERVICE_UUID );
      }).then(service => {
          cube.service = service;
          return cube.service.getCharacteristic( MOVE_CHARCTERISTICS_UUID );
          console.log("writing service characteristic");
      }).then( characteristic => {
          cube.moveChar = characteristic;
          return cube.service.getCharacteristic( SOUND_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.soundChar = characteristic;
          return cube.service.getCharacteristic( LIGHT_CHARCTERISTICS_UUID );
      }).then( characteristic => {
          cube.lightChar = characteristic;
          return cube.service.getCharacteristic( POSITION_CHARACTERISTICS_UUID );
      }).then( characteristic => {
          cube.posChar = characteristic;
          if( cube === gCubes[0] ){
            console.log("connecting cube 0");
            turnOnLightCian( cube );
            startCube( cube );
            document.getElementById('canvas').innerHTML = "<div id='toio'></div>";
            document.getElementById('toio').style.backgroundColor = activeColor;
          }else if( cube === gCubes[1] ){
            console.log("connecting cube 1");
            document.getElementById('canvas1').innerHTML = "<div id='toio3'></div>";
            document.getElementById('toio3').style.backgroundColor = activeColor;
            turnOnLightRed( cube );
            startCube( cube );
            //spin cube needs to be changed to startCube
            // spinCube(cube);
          }
      });

      return cube;
  }


  // Cube Commands
  // -- Light Commands
  const turnOffLight = ( cube ) => {

      const CMD_TURN_OFF = 0x01;
      const buf = new Uint8Array([ CMD_TURN_OFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
      }

  }


  const turnOnLightGreen = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('green');
      }

  }

  const turnOnLightCian = ( cube ) => {

      // Cian light
    const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0x00, 0xFF, 0xFF ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
          console.log('cyan');

      }

  }

  const turnOnLightRed = ( cube ) => {

      // Red light
      const buf = new Uint8Array([ 0x03, 0x00, 0x01, 0x01, 0xFF, 0x00, 0x00 ]);
      if( ( cube !== undefined ) && ( cube.lightChar !== undefined ) ){
          cube.lightChar.writeValue( buf );
      }

  }


  const startCube = ( cube ) => {

    console.log('cube connected successfully!');
    console.log(cube);
      // Green light
      spinCube(cube);


       onStartButtonClick( cube );
  }

  const spinCube = ( cube ) => {

      // Green light
      const buf = new Uint8Array([ 0x02, 0x01, 0x01, 0x64, 0x02, 0x02, 0x14, 0x64 ]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('spin');
      }

  }


  const changeConnectCubeButtonStatus = ( idButton, cube, enabled ) => {
    console.log('change button status' + 'btConnectCube' + idButton);
    document.getElementById( 'btConnectCube' + idButton).src="images/Group 46.svg";
  }








  const cubeStop = ( cubeno ) =>{
      const cube = gCubes[cubeno];
      const buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x00, 0x02, 0x01, 0x00]);
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          setTimeout(() => {cube.moveChar.writeValue( buf )},100);
          console.log('stop');
          if(cubeno==0){
            console.log('cube 1 stopping');
          }else if(cubeno==1){
            console.log('cube 2 stopping');
          }
      }
  }

  const timedMove = (moveID, speed) => {
    const cube = gCubes[0];
    if(moveID == 1){
    var buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x01, speed, 0x0A]);
  }else if(moveID == 2){
    var buf = new Uint8Array([ 0x02, 0x01, 0x02, speed, 0x02, 0x02, speed, 0x0A]);
  }else if(moveID == 3){
    var buf = new Uint8Array([ 0x02, 0x01, 0x02, speed, 0x02, 0x01, speed, 0x0A]);
  }else if(moveID == 4){
    var buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x02, speed, 0x0A]);
  }
  cube.moveChar.writeValue( buf );
  }


  const cubeMove = ( moveID, cubeno,speed ) => {
      const cube = gCubes[cubeno];
      var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);
      // forward

      console.log(speed);
      //forward
      if(moveID==1){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x01, speed]);
      console.log('cube ' + cubeno + " moving forward");
    }else if (moveID==2){
      //backward
      buf = new Uint8Array([ 0x01, 0x01, 0x02, speed, 0x02, 0x02, speed]);
    }else if (moveID==3){
      buf = new Uint8Array([ 0x01, 0x01, 0x02, speed, 0x02, 0x01, speed]);
    }else if (moveID==4){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, speed, 0x02, 0x02, speed]);
    }else if (moveID==5){
      buf = new Uint8Array([ 0x02, 0x01, 0x01, speed, 0x02, 0x01, speed, 0x50]);
    }
      if( ( cube !== undefined ) && ( cube.moveChar !== undefined ) ){
          cube.moveChar.writeValue( buf );
          console.log('move');
      }

  }


function stopping(n){
     cubeStop(0);
 };


function movingForward(n){
    console.log('moving forward');
    if(n ==0){
    cubeMove( 1 ,0 , speed1);
  }else if(n==2 || n==1){
    timedMove(1,speed1);
  }

  };

function movingBack(n){
  if(n==0){
      cubeMove( 2 ,0 , speed1);
    }else if(n==2||n==1){
      timedMove(2,speed1);
    }
   };

function movingR(n){


   console.log('moving right');
   if(n==0){
     let turnspeed1 = Math.floor(parseInt(speed1)*0.5);
     turnspeed1 = '0x' + turnspeed1.toString(16);
       cubeMove( 4 ,0 , turnspeed1);
     }else if(n==1){
       let turnspeed1 = Math.floor(parseInt(speed1)*0.35);
       turnspeed1 = '0x' + turnspeed1.toString(16);
       timedMove(4,turnspeed1);

     }else if(n==2){
       let turnspeed1 = Math.floor(parseInt(speed1)*0.76);
       turnspeed1 = '0x' + turnspeed1.toString(16);
       timedMove(4,turnspeed1);
     }
    };

function movingL(n){




   console.log('moving left');
   if(n==0){

        let turnspeed1 = Math.floor(parseInt(speed1)*0.5);
        turnspeed1 = '0x' + turnspeed1.toString(16);
       cubeMove( 3 ,0 , turnspeed1);
     }else if(n==1){
       let turnspeed1 = Math.floor(parseInt(speed1)*0.35);
       turnspeed1 = '0x' + turnspeed1.toString(16);
       timedMove(4,turnspeed1);
     }else if(n==2){

          let turnspeed1 = Math.floor(parseInt(speed1)*0.76);
          turnspeed1 = '0x' + turnspeed1.toString(16);
       timedMove(3, turnspeed1);
     }

 };

 const moveJoystick = (n, x, y, remote, speed) => {
      console.log("local joystick control");
      let cube = gCubes[n];
      let maxspeed;
      if(speed ==undefined){
      if(n==0){
      maxspeed = speed1;
    }else if(n==1 ){
    maxspeed = speed2;
    }
  }else{
    maxspeed = speed;
  }
    console.log(maxspeed);
      var buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x64, 0x02, 0x01, 0x64]);

      let stopmot = 0;

      console.log("x: "+x);
      console.log("y: "+y);
    //calculate whether the motor should go forward or backward.
    //motor speeds are encoded as -.5 to .5 so if it's over 0 then it should go forward.
      let m1fw;
      let m2fw;

      if(y<0){
        console.log("forward");
        m1fw = true;
        m2fw = true
      }else{
        console.log("backward")
        m1fw = false;
        m2fw = false
      }

      let motor1;
      let motor2;
      if(x>0 && Math.abs(y)>0.07){
        console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
          motor1 = Math.floor(Math.abs(y)*maxspeed);
          motor2 = Math.floor(motor1-Math.abs(motor1*x));
          //motor2 = Math.floor(motor1/Math.abs(x*maxspeed*.25));
          motor1 = motor1.toString(16);
          motor1 = "0x" + motor1;
          motor2 = motor2.toString(16);
          motor2 = "0x" + motor2;


      }else if(x==0 && Math.abs(y)>0.07){

    console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
      motor1 = Math.floor(Math.abs(y)*maxspeed);
      motor1 = motor1.toString(16);
      motor1 = "0x" + motor1;
      motor2 = motor1;
    }else if(x<=0 && Math.abs(y)>0.07){
      console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
        motor2 = Math.floor(Math.abs(y)*maxspeed);
        motor1 = Math.floor(motor2-Math.abs(motor2*x));
        //motor1 = Math.floor(motor2/Math.abs(x*maxspeed*.25));
        motor2 = motor2.toString(16);
        motor2 = "0x" + motor2;
        motor1 = motor1.toString(16);
        motor1 = "0x" + motor1;
      }else if(Math.abs(y)<=0.07 && x>0){
        console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
        motor1 = Math.floor(Math.abs(x)*maxspeed*0.2);
        motor2 = motor1;
        m2fw = false;
        m1fw = true;
      }else if(Math.abs(y)<=0.07 && x<=0){
        console.log(Math.floor(Math.abs(x)*maxspeed),Math.floor(Math.abs(y)*maxspeed));
        motor2 = Math.floor(Math.abs(x)*maxspeed*0.2);
        motor1 = motor2;
        m1fw = false;
        m2fw = true;
      }


      //write forward and backward values
      if(m1fw == true && m2fw==true){
       buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x01, motor2]);
      //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x32, 0x01, 0x01, 0x32]);
      }else if(m1fw == false && m2fw==true){
       buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x01, motor2]);
      //buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x01, 0x01, 0x32]);
    }else if(m1fw == true && m2fw == false){
      buf = new Uint8Array([ 0x01, 0x01, 0x01, motor1, 0x02, 0x02, motor2]);
      //buf = new Uint8Array([ 0x01, 0x01, 0x01, 0x96, 0x02, 0x01, 0x64]);

    }else{
       buf = new Uint8Array([ 0x01, 0x01, 0x02, motor1, 0x02, 0x02, motor2]);
        //  buf = new Uint8Array([ 0x01, 0x01, 0x02, 0x96, 0x02, 0x02, 0x64]);
    }

      if( ( cube !== undefined ) && ( cube.moveChar !== undefined )){
        console.log(buf);
          cube.moveChar.writeValue( buf );
          console.log('move');

      }


  }




  const initialize = () => {

    // Event Listning for GUI buttons.
    for( let cubeId of CUBE_ID_ARRAY ){
        document.getElementById( 'btConnectCube' + ( cubeId + 1) ).addEventListener( 'click', async ev => {
          console.log('clicked to connect cube');
            if( cubeId === 0 ){
                console.log("attempting to connect cube 1");
                gCubes[0] = connectNewCube();
                console.log('cube 0 connected (cyan)');
            }else if( cubeId === 1 ){
              console.log("attempting to connect cube 2");
                gCubes[1] = connectNewCube();
                console.log('cube 1 connected (green)');
            }

          });
      }
    }


initialize();

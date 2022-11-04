const haveEvents = 'ongamepadconnected' in window;
const controllers = {};

function connecthandler(e) {
  addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad;

  const d = document.createElement("div");
  d.setAttribute("id", `controller${gamepad.index}`);

  const t = document.createElement("h1");
  t.textContent = `gamepad: ${gamepad.id}`;
  d.appendChild(t);

  const b = document.createElement("div");
  b.className = "buttons";
  gamepad.buttons.forEach((button, i) => {
    const e = document.createElement("span");
    e.className = "button";
    e.textContent = i;
    b.appendChild(e);
  });

  d.appendChild(b);

  const a = document.createElement("div");
  a.className = "axes";

  gamepad.axes.forEach((axis, i) => {
    const p = document.createElement("progress");
    p.className = "axis";
    p.setAttribute("max", "2");
    p.setAttribute("value", "1");
    p.textContent = i;
    a.appendChild(p);
  });

  d.appendChild(a);

  // See https://github.com/luser/gamepadtest/blob/master/index.html
  const start = document.getElementById("start");
  if (start) {
    start.style.display = "none";
  }

  document.body.appendChild(d);
  requestAnimationFrame(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  const d = document.getElementById(`controller${gamepad.index}`);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }

let i=0;
// console.log(controllers[0]);

if(controllers.length>1){
for (const controller of controllers){
    const d = document.getElementById(`controller${i}`);
    const buttons = d.getElementsByClassName("button");

    controller.buttons.forEach((button, i) => {
    //   const b = buttons[i];
    //   let pressed = button === 1.0;
    //   let val = button;
    //
    //   if (typeof button === "object") {
    //     pressed = val.pressed;
    //     val = val.value;
    //   }
    //
    //   const pct = `${Math.round(val * 100)}%`;
    //   b.style.backgroundSize = `${pct} ${pct}`;
    //   b.className = pressed ? "button pressed" : "button";
    // });
    //
    // const axes = d.getElementsByClassName("axis");
    // controller.axes.forEach((axis, i) => {
    //   const a = axes[i];
    //   a.textContent = `${i}: ${controller.axis.toFixed(4)}`;
    //   a.setAttribute("value", controller.axis + 1);
    // });
  i+=1};
}else{
  controller = controllers[0];

  controller.buttons.forEach((button, i) => {
    if(button.pressed == true){
      console.log(i);
    }

  controller.axes.forEach((axis, i) => {
    if(Math.abs(axis)>0.1){
      console.log(axis);
      if(i==0 || i==1){
    //  p.print(outx, outy);
      moveJoystick(0, controller.axes[0], controller.axes[1], false, undefined);
    }
  }else{
    stopping(0)
  }
    }
  });
  //   let pressed = button === 1.0;
  //   let val = button;
  // //
  //   if (typeof button === "object") {
  //     pressed = val.pressed;
  //     val = val.value;
  //   }
  //   if(pressed != 0){
  //     console.log(pressed ? "button pressed" : val);
  //
  //   }
    //console.log(pressed ? "button pressed" : val);
    // console.log(val);
  });
  //
  //   const pct = `${Math.round(val * 100)}%`;
  //   b.style.backgroundSize = `${pct} ${pct}`;
  //   b.className = pressed ? "button pressed" : "button";
  // });
  //
  // const axes = d.getElementsByClassName("axis");
  // controller.axes.forEach((axis, i) => {
  //   const a = axes[i];
  //   a.textContent = `${i}: ${controller.axis.toFixed(4)}`;
  //   a.setAttribute("value", controller.axis + 1);
  // })

}
  requestAnimationFrame(updateStatus);
}

function scangamepads() {
  const gamepads = navigator.getGamepads();
  for (const gamepad of gamepads) {
    if (gamepad) { // Can be null if disconnected during the session
      if (gamepad.index in controllers) {
        controllers[gamepad.index] = gamepad;
      } else {
        addgamepad(gamepad);
      }
    }
  }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
 setInterval(scangamepads, 800);
}
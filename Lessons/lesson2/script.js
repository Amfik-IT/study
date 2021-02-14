//model
function KnightModel(myView) {
  let isJumping = false;
  let gravity = 0.9;
  let view = myView;

  this.run = (direction) => {
    view.updateRun(direction);
  }

  this.jump = () => {
    if (isJumping) return;
    let bottom = 0;
    let isDirectionUp = null;

    let upTimerId = setInterval(() => {
      //jump up
      isJumping = true;
      isDirectionUp = true;
      bottom += 3;
      bottom = bottom * gravity;
      view.updateJump(bottom, isDirectionUp);

      //jump down
      if (bottom > 25) {
        clearInterval(upTimerId);
        isDirectionUp = false;

        let downTimerId = setInterval(() => {
          bottom -= 3;
          bottom = bottom * gravity;
          view.updateJump(bottom, isDirectionUp);

          if (bottom < 0) {
            clearInterval(downTimerId);
            bottom = 0;
            view.updateJump(bottom, isDirectionUp);
            isJumping = false;
          }
        }, 20);
      }
    }, 20);
  }


}
// class KnightModel {
//   constructor(view) {
//     this.view = view;
//     this.isJumping = false;
//     this.gravity = 0.9;
//   }

//   run(direction) {
//     this.view.updateRun(direction);
//   }

//   jump() {
//     if (this.isJumping) return;
//     let bottom = 0;
//     let isDirectionUp = null;

//     let upTimerId = setInterval(() => {
//       //jump up
//       this.isJumping = true;
//       isDirectionUp = true;
//       bottom += 3;
//       bottom = bottom * this.gravity;
//       this.view.updateJump(bottom, isDirectionUp);

//       //jump down
//       if (bottom > 25) {
//         clearInterval(upTimerId);
//         isDirectionUp = false;

//         let downTimerId = setInterval(() => {
//           bottom -= 3;
//           bottom = bottom * this.gravity;
//           this.view.updateJump(bottom, isDirectionUp);

//           if (bottom < 0) {
//             clearInterval(downTimerId);
//             bottom = 0;
//             this.view.updateJump(bottom, isDirectionUp);
//             this.isJumping = false;
//           }
//         }, 20);
//       }
//     }, 20);
//   }
// }

//view
function KnightView(myContainer) {
  let container = myContainer;
  let knight = container.querySelector(".knight");

  this.updateJump = (y, isJumpingUp) => {
    if (isJumpingUp) {
      knight.classList.add("jumping");
    } else {
      knight.classList.remove("jumping");
    }

    knight.style.bottom = y + "px";
  }

  this.updateRun = (direction) => {
    switch (direction) {
      case 0:
        knight.className = "knight";
        break;
      case 1:
        knight.className = "knight right";
        break;
      case -1:
        knight.className = "knight left";
        break;
    }
  }

}
// class KnightView {
//   constructor(container) {
//     this.container = container;
//     this.knight = this.container.querySelector(".knight");
//   }

//   updateJump(y, isJumpingUp) {
//     if (isJumpingUp) {
//       this.knight.classList.add("jumping");
//     } else {
//       this.knight.classList.remove("jumping");
//     }

//     this.knight.style.bottom = y + "px";
//   }

//   updateRun(direction) {
//     switch (direction) {
//       case 0:
//         this.knight.className = "knight";
//         break;
//       case 1:
//         this.knight.className = "knight right";
//         break;
//       case -1:
//         this.knight.className = "knight left";
//         break;
//     }
//   }
// }

//controller
function KnightController(myModel, myContainer) {
  let model = myModel;
  let container = myContainer;

  this.bindEvents = () => {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          model.run(-1);
          break;
        case "ArrowRight":
          model.run(1);
          break;
        case "ArrowUp":
          model.jump();
          break;
        default:
          break;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        model.run(0);
      }
    });
  }
  this.bindEvents();
}

// class KnightController {
//   constructor(model, container) {
//     this.model = model;
//     this.container = container;
//     this.bindEvents();
//   }

//   bindEvents() {
//     document.addEventListener("keydown", (e) => {
//       switch (e.key) {
//         case "ArrowLeft":
//           this.model.run(-1);
//           break;
//         case "ArrowRight":
//           this.model.run(1);
//           break;
//         case "ArrowUp":
//           this.model.jump();
//           break;
//         default:
//           break;
//       }
//     });

//     document.addEventListener("keyup", (e) => {
//       if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
//         this.model.run(0);
//       }
//     });
//   }
// }

const container = document.getElementById("main");
const view = new KnightView(container);
const model = new KnightModel(view);
const controller = new KnightController(model, container);
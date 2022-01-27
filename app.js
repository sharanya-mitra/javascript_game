async function loop(difficulty) {
  var score = 0;
  var outResolve;
  var promise = new Promise((resolve, reject) => {
    outResolve = resolve;
  });
  window.addEventListener("keydown", (e) => {
    var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
    if (e.key == "ArrowLeft" && left > 0) {
      jet.style.left = left - 10 + "px";
    }
    //460  =>  board width - jet width
    else if (e.key == "ArrowRight" && left <= 460) {
      jet.style.left = left + 10 + "px";
    }

    if (e.key == "ArrowUp" || e.keyCode == 32) {
      //32 is for space key
      var bullet = document.createElement("div");
      bullet.classList.add("bullets");
      board.appendChild(bullet);

      var movebullet = setInterval(() => {
        var rocks = document.getElementsByClassName("rocks");

        for (var i = 0; i < rocks.length; i++) {
          var rock = rocks[i];
          if (rock != undefined) {
            var rockbound = rock.getBoundingClientRect();
            var bulletbound = bullet.getBoundingClientRect();

            //Condition to check whether the rock/alien and the bullet are at the same position..!
            //If so,then we have to destroy that rock

            if (
              bulletbound.left >= rockbound.left &&
              bulletbound.right <= rockbound.right &&
              bulletbound.top <= rockbound.top &&
              bulletbound.bottom <= rockbound.bottom
            ) {
              rock.parentElement.removeChild(rock); //Just removing that particular rock;
              //Scoreboard
              score += 1;
              document.getElementById("points").innerHTML =
                "Score: " + JSON.stringify(score);
            }
          }
        }
        var bulletbottom = parseInt(
          window.getComputedStyle(bullet).getPropertyValue("bottom")
        );

        //Stops the bullet from moving outside the gamebox
        if (bulletbottom >= 500) {
          clearInterval(movebullet);
        }

        bullet.style.left = left + "px"; //bullet should always be placed at the top of my jet..!
        bullet.style.bottom = bulletbottom + 3 + "px";
      });
    }
  });

  var generaterocks = setInterval(() => {
    var rock = document.createElement("div");
    rock.classList.add("rocks");
    //Just getting the left of the rock to place it in random position...
    var rockleft = parseInt(
      window.getComputedStyle(rock).getPropertyValue("left")
    );
    //generate value between 0 to 450 where 450 => board width - rock width
    rock.style.left = Math.floor(Math.random() * 450) + "px";

    rockWrapper.appendChild(rock);
  }, [750, 1000, 550][difficulty]); // change speed of rock generation upon difficulty change (use custom values => [easy, normal, hard])

  var moverocks = setInterval(() => {
    var rocks = document.getElementsByClassName("rocks");

    if (rocks != undefined) {
      for (var i = 0; i < rocks.length; i++) {
        //Now I have to increase the top of each rock,so that the rocks can move downwards..
        var rock = rocks[i]; //getting each rock
        var rocktop = parseInt(
          window.getComputedStyle(rock).getPropertyValue("top")
        );
        //475 => boardheight - rockheight + 25
        if (rocktop >= 475) {
          //alert("Game Over"); //replaced by end-screen menu

          clearInterval(moverocks);
          clearInterval(generaterocks);

          outResolve();
        }

        rock.style.top = rocktop + 25 + "px";
      }
    }
  }, [700, 500, 150][difficulty]); // change speed of rock movement upon difficulty change (use custom values => [easy, normal, hard])

  await promise; // waits for 'game-over'
  return score;
}

function main() {
  /* get all DOM elements */

  var menu = document.getElementById("menu");
  var menuHeader = document.getElementById("menu-header");
  var jet = document.getElementById("jet");
  var rockWrapper = document.getElementById("rockWrapper");
  var points = document.getElementById("points");
  var newgame = document.getElementById("newgame");
  var retry = document.getElementById("retry");
  var select = document.getElementById("select");
  var difficulty = document.getElementById("difficulty");
  var text = document.getElementById("help-text");
  
  /* initially hide everything */
  retry.setAttribute("style", "display : none");
  menu.setAttribute("style", "display : none");
  jet.setAttribute("style", "display : none");
  points.setAttribute("style", "display : none");
  rockWrapper.setAttribute("style", "display : none");

  /* display menu */
  menu.setAttribute("style", "display : block");

  // listen for difficulty changes
  var dif = 1; // defauts to normal
  difficulty.addEventListener("change", (e) => {
    dif = difficulty.value;
  });

  newgame.onclick = async () => {
    /* new game button clicked */

    /* hide menu */
    menu.setAttribute("style", "display : none");

    /* display other components */
    jet.setAttribute("style", "display : block");
    points.setAttribute("style", "display : block");
    rockWrapper.setAttribute("style", "display : block");

    /* start the game loop */
    var score = await loop(dif); // pass the difficulty level and wait for game over

    /* display end-screen on game-over */

    /* hide unnecessary stuff */
    jet.setAttribute("style", "display : none");
    points.setAttribute("style", "display : none");
    select.setAttribute("style", "display : none");
    rockWrapper.setAttribute("style", "display : none");
    newgame.setAttribute("style", "display : none");

    /* display menu with retry button*/
    menu.setAttribute("style", "display : block");
    retry.setAttribute("style", "display : initial");

    /* change help-text to display score*/
    menuHeader.innerHTML = "GAME OVER"
    text.innerHTML = "Your score: " + JSON.stringify(score)
    retry.onclick = () => {
      window.location.reload()
    }

  };
}

main();

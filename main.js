// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// 이미지
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;

// 게임 오버
let gameOver = false; // true면 게임 끝

let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width/2 - 32;
let spaceshipY = canvas.height - 64;

// 총알 좌표
let bulletList = [];
function Bullet(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = spaceshipX + 18;
        this.y = spaceshipY - 24;
        this.alive = true; //true면 살아있는 총알 false면 죽은 총알

        bulletList.push(this)
    };
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit = function(){
        for(let i =0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 48){
                // 총알.y <= 적군.y && 총알.x >= 적군.x && 총알.x <=적군.x + 48 ->닿았다
                score++;
                this.alive = false; //죽은 총알
                enemyList.splice(i, 1);
            }

        }
    }
}

// 적군
function generateRandomVal(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum;
}

let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = generateRandomVal(0, canvas.width - 48);
        this.y = 0;

        enemyList.push(this);
    };
    this.update = function(){
        this.y += 2;

        if(this.y >= canvas.height - 48){
            gameOver = true;//게임 끝남
        }
    }
    if(score >= 30){
        this.update = function(){
            this.y += 4;
    
            if(this.y >= canvas.height - 48){
                gameOver = true;//게임 끝남
            }
        }
    }
    if(score >= 50){
        this.update = function(){
            this.y += 6;

            if(this.y >= canvas.height - 48){
                gameOver = true;
            }
        }
    }
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src= "background.png";

    spaceshipImage = new Image();
    spaceshipImage.src= "spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "bullet.png";

    enemyImage = new Image();
    enemyImage.src = "enemy.png";

    gameoverImage = new Image();
    gameoverImage.src = "gameover.png";
}

// 방향키를 누르면
// 우주선의 x y 좌표가 바뀌고
// 다시 render
let keysDown = {};
function setUpItemsMove(){
    document.addEventListener("keydown", function(e){
        keysDown[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e){
        delete keysDown[e.keyCode];
        if(e.keyCode === 32){//스페이스 키가 눌리면
            createBullet();
            //스페이스 바를 누르면 총알 발사
            //누르면 총알의 y값 -로 이동
            //x값은 누른 당시 우주선의 x 좌표
            //여러번 누르면 총알이 여러개 발사 -> arr로 관리(arr를 render)
            //각각의 총알이 가지고 있어야 하는 정보 : x, y 좌표
            //우주선에 닿으면 우주선 폭발

        }
    })
}
function arrowMove(){
    if(39 in keysDown){// 오른쪽 키
        spaceshipX += 5;//우주선의 속도
    }
    if(37 in keysDown){
        spaceshipX -= 5;
    }
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width -64){
        spaceshipX = canvas.width -64;
    }

    //총알 y 값 업데이트 함수 호출
    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    for(let j = 0; j<enemyList.length; j++){
        enemyList[j].update();
    }
}
// class createBullet{
//     x : x,
//     y : y,
//     constructor()
// }
function createBullet(){
    let b = new Bullet();
    b.init();
}

function createEnemy(){
    // const interval = setInterval(호출하고 싶은 함수, 얼마마다 호출할건지 시간)
    const interval = setInterval(function(){
        let c = new Enemy();
        c.init();
    }, 1000);
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillStyle="white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score : ${score}`, 20, 50);
    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
        }
    }
    for(let i = 0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
    console.log("bulletList", bulletList.length, "enemyList", enemyList.length, "score", score)
}


// canvas.addEventListener("click", e => {
//     const rect = canvas.getBoundingClientRect();
//     const point = {
//         x : e.clientX - rect.left,
//         y : e.clientY - rect.top
//     };
// });

// function handleClick(e){
//     // const color = e.target.style.backgroundColor;
//     // ctx.strokeStyle = color;
//     // ctx.fillStyle = color;
//     var x = e.pageX;
//     var y = e.pageY;
//     if(ctx.isPointInPath(path, x, y)){
//         alert("hey");
//     }else{
//         alert("bye");
//     }

// }

function main(){
    if(gameOver == false){
        arrowMove();//좌표값을 업데이트하고
        render();//그려주고
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameoverImage, 0, 0, canvas.width, canvas.height);
        function showScore(ctx){
            ctx.font = `30px Arial`;
            ctx.fillStyle = `#fff`;
            ctx.fillText(`Score : ${score}`,  canvas.width / 2 - 110, 150);
        };
        showScore(ctx);

        function showRestartBtn(ctx){
            ctx.strokeStyle = "#b96479";
            ctx.fillStyle = "#b96479";
            ctx.beginPath();
            ctx.roundRect(canvas.width / 2 - 110, canvas.height / 2 + 150, 220, 80, 20);
            ctx.stroke();
            ctx.fill();
            ctx.font = "30px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText("Restart", canvas.width / 2 - 50, canvas.height / 2 + 200);
        };
        showRestartBtn(ctx);
    }
}

loadImage();
setUpItemsMove();
createEnemy();
main();

// 적군 x 좌표 랜덤, y 좌표 0 고정
// 적군의 y 좌표 +
// 1초마다 하나씩 적군이 나온다
// 적군이 바닥에 닿으면(y값 == spaceshipY) 게임 오버

// 적군이 죽는다
// 총알.y <= 적군.y
// 총알.x >= 적군.x && 총알.x <=적군.x + 48
// ->닿았다
// 총알이 죽게되고
// 적군이 없어지고 
// score +1
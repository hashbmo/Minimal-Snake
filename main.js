var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var width = 20, height = 20
var bounds = [width, height]
var snake = [[1,1],[2,1],[3,1]]

var move_dir = [0,0]
var food = []
var dirs = {
    ["a"]:[-1,0],["d"]:[1,0],
    ["w"]:[0,-1],["s"]:[0,1],
}
var dirs_adj = ["a","d","s","w"]
var last_key

var playing = false
var move_interval
var current_dir

function end_game() {
    clearInterval(move_interval)
    playing = false
}

function random(i,j) {return Math.floor((j-i)*Math.random()) + i}

function visualise(pos, col="#FFFFFF") {
    var size = canvas.clientWidth;
    var w = size/width, h = size/height
    ctx.fillStyle = col
    let [x,y] = [...pos]
    ctx.fillRect(x*w,y*w,w,h)
}

function visualise_snake(snake) {
    var size = canvas.clientWidth;
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,size,size)
    for (pos of snake) {visualise((pos), "#FFFFFF")}
}

var move = NaN
move = (snake)=>{
    var head = snake[0]
    var next = [...head]
    current_dir = move_dir
    // Check if snake is colliding with bounds
    for (let i = 0; i < 2; i++) {
        next[i] += move_dir[i]
        if (next[i] < 0 || next[i] >= bounds[i]) {
            end_game(); return;
        }
    }
    // Check if snake colliding with itself
    for (pos of snake) {
        if (next[0] == pos[0] && next[1] == pos[1]) {
            end_game(); return
        }
    }
    // Check if head is colliding with food
    if (next[0] == food[0] && next[1] == food[1]) {
        food = [random(0,width),random(0,height)]
        snake.push([])
    }
    // Move rest of snake body along
    for (let i = snake.length-1; i >= 1; i--) {
        let nxt = snake[i-1]
        snake[i] = [...nxt]
    }
    snake[0] = next
}

document.addEventListener("keydown", (ev)=>{
    var key = ev.key.toLowerCase()
    if (playing && dirs[key]) {
        if (snake.length > 1) {
            index = dirs_adj.findIndex((a)=>{return a == key})
            var invalid
            if (index % 2 == 0) {invalid = dirs_adj[index+1]}
            else {invalid = dirs_adj[index-1]}
            if (current_dir == dirs[invalid]) {return}
        }
        move_dir = dirs[key]
    }
    else if (!playing && dirs[key]) {
        playing = true
        snake = [[3,1],[2,1],[1,1]]
        move_dir = [1,0]

        food = [random(0,width),random(0,height)]
        visualise_snake(snake)
        move_interval = setInterval(()=>{
            move(snake); visualise_snake(snake); visualise(food, "#FF0000")
            if (!playing) {
                ctx.font = "15px monospace"
                ctx.fillStyle = "#FFFFFF"
                var size = canvas.width
                ctx.fillText("GAME OVER",30,30)
            }
        },100)
        console.log("t")
    };
})
visualise_snake(snake)
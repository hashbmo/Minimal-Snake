var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var width = 16, height = 16
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
var last_updated = 0

var playing = false
var start_key = "enter"
var move_interval

function end_game() {
    clearInterval(move_interval)
    ctx.font = "100px monospace"
    ctx.fillText("Game over", width/2, height/2)
    playing = false
}

function random(i,j) {
    return Math.floor((j-i)*Math.random()) + i
}

function visualise_snake(snake) {
    var size = canvas.clientWidth;
    var w = size / width, h = size / height
    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,size,size)

    ctx.fillStroke = "#FFFFFF"
    ctx.fillStyle = "#FFFFFF"
    for (pos of snake) {
        [x,y] = [...pos]
        ctx.fillRect(x*w,y*w,w,h)
    }
}

function visualise_food(pos) {
    var size = canvas.clientWidth
    var w = size / width, h = size / height
    var [x,y] = [...pos]
    ctx.fillStyle = "#FF0000"
    ctx.fillRect(x*w,y*h,w,h)
}

function eval_arr(arr1,arr2) {
    if (arr1.length != arr2.length) {return false}
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {return false}
    } return true
}

var move = NaN
move = (snake)=>{
    var head = snake[0]
    var next = [...head]
    for (let i = 0; i < 2; i++) {
        next[i] += move_dir[i]
        if (next[i] < 0 || next[i] >= bounds[i]) {
            
            end_game(); return;
        }
    }
    for (let i = 0; i < snake.length; i++) {
        hit = true
        for (n = 0; n < 2; n++) {
            if (snake[i][n] != next[n]) {
                hit = false
            }
        }
        if (hit) {
            clearInterval(move_interval)
            end_game(); return;
        }
    }
    if (eval_arr(next,food)) {
        food = [random(0,width),random(0,height)]
        snake.push([])
    }
    for (let i = snake.length-1; i >= 1; i--) {
        let nxt = snake[i-1]
        snake[i] = [...nxt]
    }
    snake[0] = [...next]
}

document.addEventListener("keydown", (ev)=>{
    var key = ev.key.toLowerCase()
    if (playing && dirs[key]) {
        if (snake.length > 1) {
            index = dirs_adj.findIndex((a)=>{return a == key})
            var invalid
            if (index % 2 == 0) {invalid = dirs_adj[index+1]}
            else {invalid = dirs_adj[index-1]}
            if (move_dir == dirs[invalid]) {return}
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
            move(snake); visualise_snake(snake); visualise_food(food)
            last_updated = Date.now()
        },100)
    };
})
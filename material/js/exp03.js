//还存在的问题：在游戏过程中点击开始按钮，会造成地鼠移动速度加快，
//其次如果要结束游戏的话，每开始点击一次开始，就要点击两次结束才能结束游戏。两次开始，四次结束。
//以上情况是点击了地鼠之后Reset导致的
//如果是没有点击地鼠，那么一次开始对应一次结束，但是还是存在点击多次开始的情况。

//定义全局变量
var gameTimeId = null;	//
var t = 30; //游戏时长 单位：秒
var v = 3000; //地鼠在洞口停留的时间 单位：毫秒
var w = 1000; //老鼠被击中后停留时间 单位：毫秒
var score = 0; //得到的分数
var reservedScore; //用于上传的成绩
var xhr = null; //ajax 变量

var holes = [
  [{x:"130px", y:"170px",isFull:false}, {x:"322px", y:"170px",isFull:false}, {x:"516px", y:"170px",isFull:false}],
  [{x:"106px", y:"262px",isFull:false}, {x:"322px", y:"262px",isFull:false}, {x:"522px", y:"262px",isFull:false}],
  [{x:"97px", y:"362px",isFull:false}, {x:"322px", y:"362px",isFull:false}, {x:"544px", y:"362px",isFull:false}],
];


window.onload = function(){
	var main = document.getElementById("main");//为什么这个main不需要定义在函数里就可以拿过来用？
  putMouses();
}

//只是把老鼠放好但是不能被hit
function putMouses(){
	var mouses = main.getElementsByTagName("span");
	for(var index=0; index<mouses.length; index++){
		mouses[index].onmouseover = mouseOver;
    mouses[index].onmouseout = mouseOut;
    if( mouses[index].onclick ){
    	mouses[index].onclick = null;
    }
	}
	mouses[0].style.left = holes[0][0].x;
  mouses[0].style.top = holes[0][0].y;
  
  mouses[1].style.left = holes[0][2].x;
  mouses[1].style.top = holes[0][2].y;
  
  mouses[2].style.left = holes[1][1].x;
  mouses[2].style.top = holes[1][1].y;
  
  mouses[3].style.left = holes[2][0].x;
  mouses[3].style.top = holes[2][0].y;
  
  mouses[4].style.left = holes[2][2].x;
  mouses[4].style.top = holes[2][2].y;
}

//让老鼠可以被hit
function initGame(){
	var mouses = main.getElementsByTagName("span");
  for(var index=0; index<mouses.length; index++){
    mouses[index].onclick = mouseHit;
    mouses[index].index = index;	//后面有用到index属性
  }
}

//移动所有老鼠的位置 
function moveMouses(index){
	var mouses = main.getElementsByTagName("span");
	for(var index=0; index<mouses.length; index++){
		moveMouse(index);
	}
}

//移动一只老鼠的位置
function moveMouse(index){
	var mouse = document.getElementById("mouse"+index);
	var i,j;
	do{
		i = Math.floor(Math.random()*3);
		j = Math.floor(Math.random()*3);
	}while( holes[i][j].isFull )
	
	mouse.style.left = holes[i][j].x;
	mouse.style.top = holes[i][j].y;
	

	if( mouse.i!=null && mouse.j!=null ){ 
		holes[mouse.i][mouse.j].isFull = false;
	}
	
	mouse.i = i;
	mouse.j = j;
	holes[i][j].isFull = true;
	
	mouse.stayId = setTimeout("moveMouse("+ index +")",v);
	
}


function startGame(){
	initGame();	//让老鼠可以被hit
	moveMouses();
	document.getElementById("lblTime").innerHTML = t;
	if( gameTimeId ){
		clearInterval( gameTimeId );
	}
	gameTimeId = setInterval(updateTime,1000);
}

function updateTime(){
	var time = document.getElementById("lblTime").innerHTML;
	var score = document.getElementById("lblScore").innerHTML;
	if( time<=0 ){
		alert("游戏时间到!\n本次你的成绩是："+score+"分");
		stopGame();
	}else{
		time--;
		document.getElementById("lblTime").innerHTML = time;
	}
}

function stopGame(){
	var mouses = main.getElementsByTagName("span");
	reservedScore = document.getElementById("lblScore").innerHTML; //保留的成绩
	clearInterval(gameTimeId);
	gameTimeId = null;
	score = 0;
	document.getElementById("lblTime").innerHTML = t;
	document.getElementById("lblScore").innerHTML = score;
	for(index=0; index<mouses.length; index++){
		clearTimeout(mouses[index].stayId);
	}
	putMouses();
	
}

function updateScore(){
	var score = document.getElementById("lblScore").innerHTML;
	if( score!=null ){
		score++;
	}
	document.getElementById("lblScore").innerHTML = score;
}
 

function mouseOver(){
  if(!this.hitted){
    this.className = "mouse over";
  }
}

function mouseOut(){
  if(!this.hitted){
    this.className = "mouse normal";
  }
}

function mouseHit(){
  this.className = "mouse hit";
  this.hitted = true; //flag
  var count = document.getElementById("count");
  var x = parseInt(this.style.left);
  count.style.left = (x+36) + "px";
  count.style.top = this.style.top;
  count.style.display = "block";
  
  if( this.stayId!=null ){
  	clearTimeout(this.stayId);
  	this.stayId = null;
  }
  Reset = setTimeout("mouseReset("+this.index+")",w);//sasa
  updateScore();
}

function mouseReset(index){
	var mouse = document.getElementById("mouse"+index);
	mouse.className = "mouse normal";
	document.getElementById("count").style.display = "none";
	moveMouse(mouse.index);
}


//上传成绩
function postScore(){
	var userName = prompt("请输入用户名");
	var postUrl = "http://192.168.99.203/lab/ajax/add.asp";

	//initXhr()
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xhr.open("POST",postUrl);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.onreadystatechange = showPostLog;
	
	var body = "score="+reservedScore+"&name="+userName;
	xhr.send(body);
}

function showPostLog(){
	if(xhr.readyState==4){
		if(xhr.status==200){
			var json = JSON.parse(xhr.responseText);
			var log;
			if(json.code==1){
				log = "OK!"
			}else if(json.code==0){
				log = "ERROR!" + json.msg;
			}
			alert(log);
		}
	}
}
//获取成绩
function getScore(){
	var getUrl = "http://192.168.99.203/lab/ajax/get.asp?appKey=201512201401030";
	
	//initXhr()
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xhr.open("GET",getUrl);	
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.onreadystatechange = showGetLog();
}

function showGetLog(){
	if(xhr.readyState==4){
		if(xhr.readyState==200){
			var json = JSON.parse(xhr.responseText);
			var log ="";
			if(json.code==1){
				log = xhr.responseText;
			}else{
				log = json.msg;
			}
			alert(log);
		}
	}
}






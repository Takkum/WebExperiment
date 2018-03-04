//定义一些全局变量
var gameID = 0;
//通过getTime()来实现时间的差
var date;	
var new_date;
var sum;	//记录的总毫秒数
var t;	//计时器

//用Json设定有关规则
var arr = ["001","004","013","017"];
var info = {
	source:	[{id:"img1",path:"../img/minions/001.png"},
	{id:"img2",path:"../img/minions/004.png"},
	{id:"img3",path:"../img/minions/013.png"},
	{id:"img4",path:"../img/minions/017.png"}],
	choice:{question:"",answer:""},
	log:"",
	flag:false,
	level:0,
	time:0,
	score:100,
};


//具体函数实现
window.onload = function(){
	if( gameID == 0){
		arr.sort(randomSort);
		setPic();
		clearTime();
	}
}

//-------------------------------------------
//实现重置按钮功能	
//-------------------------------------------
function resetGame(){
	arr.sort(randomSort);
	setPic();
	clearTime();
	clearArea();
	clearStar();
	info.score = 60;
	info.choice.question ="";
	info.level = 0;
}
function clearArea(){
	info.log = "";
	$(".showAnswer").get(0).innerHTML = info.log;
}

function clearStar(){
	var str = "../img/star_error.png";
	info.level = 0;
	for(var index = 1;index<=3;index++){
		$("#star"+index).get(0).src = str;
	}
}

function randomSort(){
	return Math.random()>0.5? -1:1;
}

function setPic(){
	for(var i=0;i<arr.length;i++){
		var str = "../img/minions/"+arr[i]+".png";
		info.source[i].path = str;
		$("#"+ info.source[i].id).get(0).src = info.source[i].path;
	}
}

//-------------------------------------------
//实现调换按钮功能
//-------------------------------------------
function changePic(){
	//隐藏上方图像
	for(var i=0;i<arr.length;i++){
		var str = "../img/minions/blank.jpg";
		$("#"+info.source[i].id).get(0).src = str;
	}
	//随机选择两张图片，交换它们的位置
	var a = Math.floor((Math.random()*4));
	var b = Math.floor((Math.random()*4));
	while(a==b){
		a = Math.floor((Math.random()*4));
		b = Math.floor((Math.random()*4));
	}
	change(a,b);
	info.level++;
	info.flag = true;
	info.choice.question="";//每次调换后，玩家选择的问题会改变，因此要清零
	//输出log
	$(".showAnswer").get(0).innerHTML = info.log;
}
function change(indexA,indexB){
	var temp = info.source[indexA].path;
	info.source[indexA].path = info.source[indexB].path;
	info.source[indexB].path = temp;
	info.log += info.source[indexA].id+ "和"+info.source[indexB].id+"交换；";
}

//-------------------------------------------
//实现核对问题和答案功能
//-------------------------------------------
function chooseQuestion(pic){
	if(!info.flag){
		alert("请先调换图片，再选择答案!");
		return ;
	}
	if(info.choice.question == ""){
		var str = "../img/minions/question.jpg"
		$("#"+pic).get(0).src = str;//将单击的图片换成问号的图片
		// 找到用户选择的那种图片，然后将这张图片的src传给question
		for(var i=0;i<arr.length;i++){
			if(pic == info.source[i].id){
				 info.choice.question = info.source[i].path;
				 break;
			}
		}
	}else{
		alert("只能选择一张图片回答，您已选择！");
	}
}

function chooseAnswer(src){
	if(info.choice.question ==""){
		alert("请选择一张图片回答！");
		return ;
	}
	console.log(src);
	console.log(info.choice.question);
	//将答案图片的路径传给answer
	info.choice.answer = src;
	if(info.choice.question == info.choice.answer){
		alert("恭喜你，回答正确！");
		stopTime();
		if(isNaN(sum)){
			info.time = Math.floor(parseInt(sum/1000));
		}else{
			info.time = Math.floor(sum/1000);
		}
		getScore();
		showStar();
	}else{
		// 这里该做什么呢？
		alert("您选错了，再次调换！");
		changePic();
	}
}

//-------------------------------------------
//实现计时功能
//-------------------------------------------
function startTime(){
	date = new Date().getTime();
	t = setInterval("countTime()",1000);
}

function countTime(){
	new_date = new Date().getTime();
	sum = new_date-date;
	var minutes = Math.floor(sum/(1000*60));
	var seconds = Math.floor((sum/1000)%60);
	if(minutes<10){
		minutes = "0"+minutes;
	}
	if(seconds<10){
		seconds = "0"+seconds;
	}
	$("#showTime").get(0).innerHTML = minutes+":"+seconds;
}

function stopTime(){
	clearInterval(t);
}

function clearTime(){
	clearInterval(t);
	$("#showTime").get(0).innerHTML = "00:00";
	
}

//-------------------------------------------
//定义游戏规则，并以星星方式给出成绩
//level每+1，score+5;time每+1s，score-3。
// ≤0分，没星星
// [0,30)分，一颗星星
// [30,80)，两颗星星
// ≥80分，三颗星星
//-------------------------------------------
function getScore(){
	var level = info.level;
	var time = info.time;
	var score = info.score;
	console.log(level);
	console.log(time);
	score += level*5 + time*(-3);
	info.score = score;
	console.log(info.score);
}
function showStar(){
	var score = info.score;
	if( score<=0 ){
		//这里什么都不做；
	}else if( score>0 && score<30 ){
		$("#star1").attr("src","../img/star_good.png");
	}else if( score>=30 && score<80){
		$("#star1").attr("src","../img/star_good.png");
		
		$("#star2").attr("src","../img/star_good.png");
	}else{
		$("#star1").attr("src","../img/star_good.png");
		$("#star2").attr("src","../img/star_good.png");
		$("#star3").attr("src","../img/star_good.png");
	}
}








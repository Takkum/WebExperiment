//实验01:

//输出一张素数表1-100以内的素数表，将素数、合数用不同的颜色区分开
//其中，1既不是素数也不是合数


function isprime(N){
	//isprime
	var flag=1;
	for(var i=2;i<=Math.sqrt(N);i++ ){
		if( N%i==0){
			//not prime
			flag=0;
			break;
		}
	}
	return flag;
}

function write2table(){
	document.write("<table border='1' align='center'>");
	for(var i=0;i<10;i++){
		document.write("<tr></tr>")
		for(var j=1;j<=10;j++){
			var num=i*10+j;
			if( num==1 ){
				document.write("<td bgcolor='aqua' width='50' height='50' align='center'>"+num+"</td>");
				continue;
			}
			if( isprime(num) ){
				document.write("<td bgcolor='antiquewhite' width='50' height='50' align='center'>"+num+"</td>");
			}else{
				document.write("<td bgcolor='chartreuse' width='50' height='50' align='center'>"+num+"</td>");
			}
		}
	}
	document.write("</table >");
}

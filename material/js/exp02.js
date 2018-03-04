//实验二：计算月工资个人所得税和年终奖个人所得税
//并给出最佳发放建议
//

var tax = {
	free:3500,
	levels:[
	{low:0,high:1500,rate:0.03,sub:0},
	{low:1500,high:4500,rate:0.1,sub:105},
	{low:4500,high:9000,rate:0.2,sub:555},
	{low:9000,high:35000,rate:0.25,sub:1005},
	{low:35000,high:55000,rate:0.30,sub:2755},
	{low:55000,high:80000,rate:0.35,sub:5505},
	{low:80000,high:Number.MAX_VALUE,rate:0.45,sub:13505},
	],
	calMonthTax:function(monthSalary){
		var left = monthSalary-this.free;
		var ptax;
		if ( left <= 0 ){
			ptax = 0;
		}
		for(index in this.levels){
			if(left>this.levels[index].low && left<=this.levels[index].high){
				ptax = left*this.levels[index].rate-this.levels[index].sub;
			}
		}
	return ptax;
	},

	calYearTax:function(yearSalary,monthSalary){
		var left = monthSalary-this.free;
		var ytax,rate,sub;
		if( !left ){
			var quotient = (yearSalary-Math.abs(left))/12;
			for(index in this.levels){
				if(quotient>this.levels[index].low && quotient<=this.levels[index].high){
					rate = this.levels[index].rate;
					sub = this.levels[index].sub;
				}
			}
		}else{
			var quotient = yearSalary/12;
			for(index in this.levels){
				if(quotient>this.levels[index].low && quotient<=this.levels[index].high){
					rate = this.levels[index].rate;
					sub = this.levels[index].sub;
				}
			}
		}
			ytax = yearSalary*rate - sub;
	return ytax;
	},
	showInfo:function(){
		var monthSalary = [3500,7000,10000,15000,50000,80000,100000];
		var yearSalary = [];
		for(var i=0;i<monthSalary.length;i++){
			yearSalary[i] = Math.floor(Math.random()*18+3)*monthSalary[i];
			document.write( "<div id='docfont'>月工资 "+monthSalary[i]+" 元，应缴纳月工资所得税  "+this.calMonthTax(monthSalary[i])+" 元；年终奖 "+yearSalary[i]+" 元，应缴纳年终奖所得税 "+this.calYearTax(yearSalary[i],monthSalary[i])+" 元,全年一共要缴纳个人所得税  "+(this.calMonthTax(monthSalary[i])*12+this.calYearTax(yearSalary[i],monthSalary[i]))+"  元。</div>" );
			document.write("<br />");
		}
	}
}

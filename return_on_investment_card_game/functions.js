var queued_messages = [];
var timeouts = [];

function addLine(string, queue=false)
{
	var line = $("<div>");
	line.html(string);
	
	if (queue)
	{
		queued_messages.push(line);
	}
	else
	{
		$("#scroll-content").append(line);
	}
}

function parseMoney(money)
{
	money*=100;
	money = Math.round(money);
	money/=100;
	money = String(money);
	
	if (money.indexOf(".") === -1)
	{
		return "$" + money + ".00";
	}
	
	while (money.length - money.indexOf(".") < 3)
	{
		 money += 0;
	}
	return "$" + money;
}
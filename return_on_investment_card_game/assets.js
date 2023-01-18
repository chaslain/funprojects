var on_sale = []; // what assets are on sale
var all_on_sale = 0;
class OnSaleAsset
{
	constructor(rank, suit)
	{
		this.id = all_on_sale;
		all_on_sale++;
		this.rank = rank;
		this.suit = suit;
		this.value = card_values[rank].value;
		this.rate = card_values[rank].rate;
		this.age = 0;
	}
	
	get value_f()
	{
		return parseMoney(this.value);
	}
	
	get rate_f()
	{
		var result = this.rate*1000;
		result = Math.round(result);
		result /= 10;
		result = String(result) + "%";
		return result;
	}
	
	get money_rate_f()
	{
		return parseMoney(this.value * this.rate);
	}
	
	get price()
	{
		return this.value*(Math.pow(0.95, this.age));
	}
	
	get price_f()
	{
		return parseMoney(this.price);
	}
	
	// removes from on sale and returns the object
	static removeById(id)
	{
		var newOnSale = [];
		var result = null;
		for (let i in on_sale)
		{
			if (on_sale[i].id == id)
			{
				result = on_sale[i];
			}
			else
			{
				newOnSale.push(on_sale[i]);
			}
		}
		
		on_sale = newOnSale;
		return result;
	}
	
}






class Asset
{
	constructor(id, roi, value, rank, suit)
	{
		this.id = id;
		this.base_roi 	= roi;
		this.value 	= value;
		this.comp_cards = 0;
		this.pay_history = [];
		this.rank = rank;
		this.suit = suit;
		this.amount_to_pay = null;
	}
	get roi()
	{
		let result = this.base_roi;
		if (this.comp_cards > 1)
		{
			for (let i = 0; i < this.comp_cards; i++)
			{
				result*=1.1;
			}
		}
		
		return result;
	}
	
	get roi_f()
	{
		var result = this.roi*1000;
		result = Math.round(result);
		result /= 10;
		result = String(result) + "%";
		return result;
	}
	
	get cash_roi()
	{
		return this.roi*this.value;
	}
	
	get amount_coming()
	{
		return this.amount_to_pay;
	}
	
	// register that the player is paid what is returned and the asset can forget this
	register_pay()
	{
		let result = this.amount_to_pay;
		this.pay_history.push(result);
		this.amount_to_pay = null;
		return result;
	}
	
	// picks a new amount to pay the player. can be accessed by getting property amount_coming
	new_pay_type()
	{
		let rselection = Math.floor(Math.random()*rate_probability.length);
		let rfactor = rate_probability[rselection];
		let pay = this.roi*this.value*rfactor;
		this.amount_to_pay = pay;
	}
	
	displayAssetHistory()
	{
		$(".asset-val").text(parseMoney(this.value));
		$(".asset-base-roi").text(this.base_roi);
		$(".asset-roi-p").text(this.roi_f);
		$(".asset-roi-c").text(parseMoney(this.cash_roi));
		var average_percent = 0;
		var average_dollar = 0;
		var total = 0;
		for (let i in this.pay_history)
		{
			total += this.pay_history[i];
			let row = $("<tr>");
			let cell_count = $("<td>");
			cell_count.html(parseInt(i)+1);
			let cell_percent = $("<td>");
			let cell_amount  = $("<td>");
			let percentage = this.pay_history[i]/this.value;
			average_percent += percentage;
			percentage *= 10000;
			percentage = Math.round(percentage);
			percentage/=100;
			average_dollar += this.pay_history[i];
			cell_percent.html(percentage + "%");
			cell_amount.html(parseMoney(this.pay_history[i]));
			row.append(cell_count);
			row.append(cell_percent);
			row.append(cell_amount);
			$(".asset-history-list").append(row);
		}
		average_percent /= this.pay_history.length;
		average_dollar  /= this.pay_history.length;
		
		average_percent *= 100;
		average_percent = Math.round(average_percent);
		average_percent /= 100;
		
		if (isNaN(average_percent))
		{
			average_percent = "0";
		}
		
		if (isNaN(average_dollar))
		{
			average_dollar = "0";
		}
		
		$(".asset-average-p").text(average_percent);
		$(".asset-average-c").text(parseMoney(average_dollar));
		
		$(".asset-total").html(parseMoney(total));
	}
}

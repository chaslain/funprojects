var comb_selected = [];


class Player
{
	constructor(playernum)
	{
		this.playernum = playernum;
		this.money = 50000;
		this.assets = [];
		this.asset_groups = [];
	}
	
	newGroup()
	{
		for (let i in comb_selected)
		{
			this.deleteGroupsWithAsset(comb_selected[i]);
		}
		
		this.asset_groups.push(comb_selected);
		this.calculateCompCount();
	}
	
	calculateCompCount()
	{
		var result = [];
		for (let i in this.asset_groups)
		{
			for (let j in this.asset_groups[i])
			{
				if (result[this.asset_groups[i][j]] == undefined)
				{
					result[this.asset_groups[i][j]] = this.asset_groups[i].length;
				}
				else
				{
					result[this.asset_groups[i][j]] += this.asset_groups[i].length;
				}
			}
		}
		
		for (let i in result)
		{
			this.setAssetCompCardCountById(i, result[i]);
		}
	}
	
	deleteGroupsWithAsset(id)
	{
		var new_assets = [];
		for (let i in this.asset_groups)
		{
			var is_deleted = false;
			for (let j in this.asset_groups[i])
			{	
				if (this.asset_groups[i][j] == id)
				{
					console.log("removing group", this.asset_groups[i]);
					is_deleted = true;
				}
			}
			
			if (!is_deleted)
			{
				new_assets.push(this.asset_groups[i]);
			}
		}
		
		this.asset_groups = new_assets;
	}
	
	getGroupFromAsset(id)
	{
		for (let i in this.asset_groups)
		{
			for (let j in asset_groups[i])
			{
				if (asset_groups[i][j].id == id)
				{
					return i;
				}
			}
		}
		
		return -1;
		
	}
	
	pay() // function to pay player
	{
		var toAdd = 0;
		// get interest
		if (this.money < 0)
		{
			toAdd += this.money*0.07;
		}
		else
		{
			toAdd += this.money*0.01;
		}
		for (let i in this.assets)
		{
			toAdd+=this.assets[i].register_pay();
		}
		
		this.money+=toAdd;
	}
	
	updateUI()
	{
		let par = $(this.player_id);
		let money_color = "green";
		
		if (this.money < 0)
		{
			money_color = "red";

		}
		
		let income_sign = "+";
		let income_color = "black";
		
		if (this.income < 0)
		{
			income_sign = "-";
			income_color = "red";
		}
		
		if (this.net_worth >= 0)
		{
			var net_worth_sign = "";
			var net_worth_color = "black";
		}
		else
		{
			var net_worth_sign = "-";
			var net_worth_color = "red";
		}
		
		
		par.find(".cash").html(this.money_f).css("color", money_color);
		par.find(".income").html(income_sign + this.income_f).css("color", income_color);
		par.find(".net-worth").html(net_worth_sign + this.net_worth_f).css("color", net_worth_color);
		
	}
	
	get net_worth_f()
	{
		return parseMoney(this.net_worth);
	}
	
	get net_worth()
	{
		var result = this.money;
		
	
		for (let i in this.assets)
		{
			result += this.assets[i].value;
		}
		return result;
	}
	
	get player_id()
	{
		return ".player[player="+this.playernum+"]";
	}
	
	get income()
	{
		// first, cash interest
		var result = 0;
		if (this.money > 0)
		{
			result+=.01*this.money;
		}
		else
		{
			result+=.07*this.money;
		}
		
		for (let i in this.assets)
		{
			result+=this.assets[i].cash_roi;
		}

		return result;
	}
	
	get name()
	{
		return $(this.player_id).find('input').val();
	}
	
	
	highlight()
	{
		$(this.player_id).css('background', "yellow");
	}
	
	unhighlight()
	{
		$(this.player_id).css('background', 'none');
	}
	
	get income_f()
	{
		return parseMoney(Math.abs(this.income));
	}
	
	get money_f()
	{
		return parseMoney(this.money);
	}
	
	displayEndTurn()
	{
		let interest_report = 0;
		let total = 0;
		let assets = 0;
		if (this.money < 0)
		{
			interest_report = this.money*0.07;
			$(".interest-report").html("Interest Penatly: " + parseMoney(interest_report)).css("color", "red");
		}
		else
		{
			interest_report = this.money*0.01;
			$(".interest-report").html("Interest Earned: " + parseMoney(interest_report)).css("color", "green");
		}
		
		total += interest_report;
		$(".end-turn-asset-list").empty();
		for (let i in this.assets)
		{
			this.assets[i].new_pay_type();
			total += this.assets[i].amount_coming;
			assets += this.assets[i].amount_coming;
			let amount_coming = this.assets[i].amount_coming;
			
			
			timeouts.push(setTimeout(()=>
			{
				let card = $("<div class='card-info drop-card card-info-mini'>");
				let content = "<div class='card-info-rank'>" + this.assets[i].rank + " of " + this.assets[i].suit + "</div>";
				content += "<div>Value: " + parseMoney(this.assets[i].value) + "</div>";
				content += "<div>Typical ROI: " + this.assets[i].roi_f + "</div><div>(" + parseMoney(this.assets[i].cash_roi) + ")</div>";
				card.html(content);
				let roi_actual = $("<div class='card-roi-text'>");
				if (amount_coming < 0)
				{
					roi_actual.css('color', 'red');
					
				}
				else if (amount_coming < this.assets[i].cash_roi)
				{
					roi_actual.css('color', 'yellow');
				}
				else
				{
					roi_actual.css('color', 'green');
				}
				
				roi_actual.html(parseMoney(amount_coming));
				card.append(roi_actual);
				$(".end-turn-asset-list").append(card);
				
			}
			, i*500));
		}
		
		$(".asset-income").html(parseMoney(assets));
		$(".total-income").html(parseMoney(total));
		$(".balance").html(parseMoney(this.money+total));
	}
	
	displayAssets(selector)
	{
		$(selector).empty();
		for (let i in this.assets)
		{
			let card = $("<div class='card-info card-info-mini' identity=" + this.assets[i].id + " owner='"+this.playernum+"'>");
			let content = "<div class= 'card-info-rank'>" + this.assets[i].rank + " of " + this.assets[i].suit + "</div>";
			content += "<div>Value: " + parseMoney(this.assets[i].value) + "</div>";
			content += "<div>Typical ROI: " + this.assets[i].roi_f + "</div><div>(" + parseMoney(this.assets[i].cash_roi) + ")</div>";
			card.html(content);
			$(selector).append(card)
		}
	}
	
	setAssetCompCardCountById(id, count)
	{
		for (let i in this.assets)
		{
			if (id == this.assets[i].id)
			{
				this.assets[i].comp_cards = count;
				return true;
			}
		}
		
		return false;
	}
	
	getAssetById(id)
	{
		var result = null;
		for (let i in this.assets)
		{
			if (id == this.assets[i].id)
			{
				result = this.assets[i];
			}
		}
		return result;
	}
	
	removeAssetById(id)
	{
		let newAssetList = [];
		var result = null;
		for (let i in this.assets)
		{
			if (id == this.assets[i].id)
			{
				result = this.assets[i];
			}
			else
			{
				newAssetList.push(this.assets[i]);
			}
		}
		
		this.assets = newAssetList;
		return result;
	}
	
	
}

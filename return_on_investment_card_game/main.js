$(document).ready(function(){

var game_deck = [];



var player_trade_target = null;

var property_purchased = 0;

var trade = [];

var trade_target_player = null;




// shuffle the game deck
{
	let deck_copy = [];
	
	for (let i in deck)
	{
		deck_copy.push(deck[i]);
	}
	
	while (deck_copy.length > 0)
	{
		let i = Math.floor(Math.random()*deck_copy.length);
		game_deck.push(deck_copy[i]);
		deck_copy.splice(i,1);
	}
}
// uncomment to unshuffle deck
// game_deck = deck;



// now game_deck is an array with an accesible amount

function draw()
{
	if (game_deck.length > 0)
	{
		var card = game_deck.splice(0,1)[0];

		var newOnSale = new OnSaleAsset(card.rank, card.suit);
		on_sale.push(newOnSale);
	}
}

var player_turn = 0;



function start_game()
{
	var numplayers = prompt("How many players?", "4");
	player_turn = 0; // player 1's turn
	players = [];
	$(".player input").val('');

	
	for (let i = 0; i < numplayers; i++)
	{
		players[i] = new Player(i);
		players[i].updateUI();
		
		if (i > 0)
		{
			let playerUI = $(".player[player=0]").clone().attr("player", i);
			$(".scores").append(playerUI);
		}
	}
	
	players[0].highlight();
	
	draw();
	draw();
	draw();
	
	displayOnSale();
	
	$(".player").click(open_trade_screen);

}

start_game();


function click_card(e)
{
	if (!property_purchased)
	{
		var id = $(e.target).attr("identity");
		
		var pos = $(e.target)[0].getBoundingClientRect();
		let animation_card = $(e.target).clone().addClass("card-info-sold");
		$(e.target).css('visibility', 'hidden');
		animation_card.css({left: pos.left-20, top: pos.top-20});
		animation_card.removeAttr("on_sale");
		animation_card.removeAttr("identity");
		setTimeout(()=>{animation_card.remove();}, 999);
		$("body").append(animation_card);
		let onsale = OnSaleAsset.removeById(id);
		
		players[player_turn].money -= onsale.price;
		players[player_turn].assets.push(new Asset(onsale.id, onsale.rate, onsale.value, onsale.rank, onsale.suit));
		addLine(players[player_turn].name + " purchased the " + onsale.rank + " of " + onsale.suit
		+ " for " + onsale.price_f + " (" + parseMoney(onsale.value - onsale.price) + " discount)", true);
		property_purchased = true;
		players[player_turn].updateUI();
	}
}

function end_turn_1()
{
	$(".screen-filter").css("display", "block");
	$(".end-turn-screen-parent").css("display", "block");
	$(".end-turn-screen").addClass("end-turn-screen-slide-in");
	
	setTimeout(()=>
	{
		$(".end-turn-screen").removeClass("end-turn-screen-slide-in");
		players[player_turn].displayEndTurn();
		
	}, 1000);
	
	$(".final-end-turn").click(end_turn_2);
	
}

function end_turn_2()
{
	$(".interest-report").empty();
	$(".end-turn-asset-list").empty();
	$(".final-end-turn").off('click');
	$(".screen-filter").css('display', 'none');
	$(".end-turn-screen").addClass("end-turn-screen-slide-out");
	setTimeout(()=>
	{
		$(".end-turn-screen").removeClass("end-turn-screen-slide-out");
		$(".end-turn-screen-parent").css("display", "none");
		$(".end-turn-asset-list").empty();
		
		for (let i in timeouts)
		{
			clearTimeout(timeouts[i]);
		}
		timeouts = [];
	}, 400);
	
	property_purchased = false;
	
	//$("#scroll-content").animate({opacity:0}, ()=>
	//{
		
		$("#scroll-content").empty();
		
		players[player_turn].pay();
		players[player_turn].updateUI();
		players[player_turn].unhighlight();
		player_turn++;
		
		if (player_turn >= players.length)
		{
			player_turn = 0;
		}
		players[player_turn].highlight();
		
		
		
		for (let i in on_sale)
		{
			on_sale[i].age++;
		}
		
		if (on_sale.length < 3)
		{
			draw();
		}

		
		displayOnSale();
		//$("#scroll-content").animate({opacity:1});
	//});
	
	
	
}



function displayOnSale()
{
	var par = $("<div class='card-info-parent'>");
	for (let i in on_sale)
	{
		let content = $("<div class='card-info' on_sale identity="+on_sale[i].id+">");
		var description = on_sale[i].rank + ' of ' + on_sale[i].suit + "<br>"
		+ "Price: " + on_sale[i].price_f + "<br>"
		+ "Value: " + on_sale[i].value_f + "<br>Return: " + on_sale[i].rate_f + " (" + on_sale[i].money_rate_f + ")";

		content.html(description);
		par.append(content);
		
		if (on_sale[i].age == 0)
		{
			content.addClass('new-card');
			
			setTimeout(()=>{content.removeClass('new-card');}, 800);
		}
		
	}
	addLine(par);
	addLine("<div class='pass btn'>Done</div>");
	
	$(".card-info[on_sale]").click(click_card);
	$(".pass").click(end_turn_1);
	/*$(".pass").contextmenu((e)=>
	{
		e.preventDefault();
		end_turn_1();
		end_turn_2();
	}); */
}

function display_queued()
{
	for (let i in queued_messages)
	{
		addLine(queued_messages[i]);
	}
	queued_messages = [];
}

// begin self asset view / combination selection

function open_self_screen(playerNumber)
{
	players[playerNumber].displayAssets('.asset-list-self');
	$(".screen-filter").css("display", "block");
	$(".obs-dialog").css("display", "block");
	$(".obs-screen").addClass("end-turn-screen-slide-in");
	
	setTimeout(()=>{$(".obs-screen").removeClass("end-turn-screen-slide-in");}, 800);
	
	$(".card-info[owner]").click(self_screen_handle_click);
	$(".self-observe-exit").click(close_self_screen);
	$(".check-combo").click(check_combo);
	$(".card-info[owner]").contextmenu(displayHistory);
	
	comb_selected = [];
}


function displayHistory(e)
{
	e.preventDefault();
	var id = $(e.currentTarget).attr("identity");
	$(".obs-dialog-detail").css("display", "block");;
	players[player_turn].getAssetById(id).displayAssetHistory();
	$(".self-observe-exit-2").click(closeDisplayHistory);
}

function closeDisplayHistory()
{
	$(".self-observe-exit-2").off("click");
	$(".obs-dialog-detail").css("display", "none");
	$(".asset-history-list").empty();
}

function self_screen_handle_click(e)
{
	var card = $(e.currentTarget);
	
	var index = comb_selected.indexOf(card.attr("identity"));
	
	if (index === -1)
	{
		comb_selected.push(card.attr('identity'));
		card.addClass("trade-considering");
	}
	else
	{
		comb_selected.splice(index,1);
		card.removeClass("trade-considering");
	}
}

function check_combo()
{
	if (comb_selected.length > 2)
	{
		var allAssets = [];
		
		for (let i in comb_selected)
		{
			allAssets.push(players[player_turn].getAssetById(comb_selected[i]));
		}
		
		if (ComplimentaryLogic.validateGroup(allAssets))
		{
			alert("Formed Group");
			players[player_turn].newGroup();
			players[player_turn].updateUI();
			$(".trade-considering").removeClass('trade-considering');
			comb_selected = [];
		}
		else
		{
			alert("No group formed");
		}
	}
	else
	{
		alert("No group formed");
	}
}



function close_self_screen()
{
	$(".check-combo").off('click');
	$(".screen-filter").css("display", "none");
	$(".obs-screen").addClass("end-turn-screen-slide-out");
	
	setTimeout(()=>
	{
		$(".obs-screen").removeClass("end-turn-screen-slide-out");
		$(".obs-dialog").css('display', 'none');
	}, 400);
}

// begin trading
function open_trade_screen(e)
{
	trade = [];
	
	if ($(e.target).prop("tagName") == "INPUT")
	{
		return;
	}
	
	var target = $(e.currentTarget);
	var playerNumber = target.attr("player");
	
	if (playerNumber == player_turn)
	{
		open_self_screen(playerNumber);
		return;
	}
	if (playerNumber == null)
	{
		return;
	}
	trade_target_player = playerNumber;
	console.log(players[trade_target_player]);
	var player = players[playerNumber];
	
	$(".screen-filter").css("display", "block");
	$(".trade-dialog").css("display", "block");
	$(".trade-screen").addClass("end-turn-screen-slide-in");
	
	setTimeout(()=>{$(".trade-screen").removeClass("end-turn-screen-slide-in");}, 800);

	
	player.displayAssets(".trade-right");
	players[player_turn].displayAssets(".trade-left")
	
	$(".trade-left-player-name").text(players[player_turn].name);
	$(".trade-right-player-name").text(player.name);
	
	
	$(".trade-cancel").click(close_trade_screen);
	$(".trade-propose").click(completetrade);
	
	$(".card-info[owner]").click(handleTradeClick);
	$("#left-money-offer").val('');
	$("#right-money-offer").val('');
	
}

function completetrade()
{
	$(".trade-propose").off('click');
	$(".trade-cancel").off('click');
	// save the assets to these arrays
	var assets_for_p1 = [];
	var assets_for_p2 = [];
	
	for (let i in trade[player_turn])
	{
		assets_for_p2.push(players[player_turn].removeAssetById(trade[player_turn][i]));
	}
	
	for (let i in trade[trade_target_player])
	{
		assets_for_p1.push(players[trade_target_player].removeAssetById(trade[trade_target_player][i]));
	}
	
	for (let i in assets_for_p1)
	{
		players[player_turn].assets.push(assets_for_p1[i]);
	}
		
	for (let i in assets_for_p2)
	{
		players[trade_target_player].assets.push(assets_for_p2[i]);
	}
	
	
	var left_money = $("#left-money-offer").val();
	var right_money = $("#right-money-offer").val();
	console.log(trade_target_player);
	
	if (left_money == parseFloat(left_money))
	{
		players[player_turn].money -= parseFloat(left_money);
		players[trade_target_player].money += parseFloat(left_money);
	}
	
	if (right_money == parseFloat(right_money))
	{
		players[trade_target_player].money -= parseFloat(right_money);
		players[player_turn].money += parseFloat(right_money);
	}
	
	trade = [];
	
	
	players[player_turn].calculateCompCount();
	players[trade_target_player].calculateCompCount();
	
	players[player_turn].updateUI();
	players[trade_target_player].updateUI();
	close_trade_screen();
	
	trade_target_player = null;
}

function handleTradeClick(e)
{
	var target = $(e.currentTarget);
	
	if (trade[target.attr("owner")] === undefined)
	{
		trade[target.attr("owner")] = [];
	}
	
	var index = trade[target.attr("owner")].indexOf(target.attr("identity"));
	
	if (index === -1)
	{
		trade[target.attr("owner")].push(target.attr('identity'));
		target.addClass("trade-considering");
	}
	else
	{
		trade[target.attr("owner")].splice(index,1);
		target.removeClass("trade-considering");
	}
	
}

function close_trade_screen()
{
	$(".trade-left-player-name").empty();
	$(".trade-right-player-name").empty();
	$(".trade-asset-list").empty();
	$(".trade-cancel").off("click");
	$(".trade-screen").addClass("end-turn-screen-slide-out");
	$(".screen-filter").css("display", "none");
	
	$(".trade-propose").off('click');
	$(".trade-cancel").off('click');
	
	setTimeout(function() 
	{
		$(".trade-dialog").css("display", "none"); 
		$(".trade-screen").removeClass("end-turn-screen-slide-out");
	}, 400);
}



});
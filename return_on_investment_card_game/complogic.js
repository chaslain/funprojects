class ComplimentaryLogic
{
	static validateGroup(group)
	{
		if (group[0].suit == group[1].suit)
		{
			return ComplimentaryLogic.isValidConsecutive(group);
		}
		else
		{
			return ComplimentaryLogic.isValidMatching(group);
		}
	}
	
	static isValidConsecutive(group)
	{
		var ranksOnly = [];
		var smallest = 13;
		var suit = group[0].suit;
		
		for (let i in group)
		{
			if (group[i].suit !== suit)
			{
				return false;
			}
			if (group[i].rank == "K")
			{
				ranksOnly.push(13);
			}
			else if (group[i].rank == "Q")
			{
				ranksOnly.push(12);
				
				if (smallest > 12)
				{
					smallest = 12;
				}
			}
			else if (group[i].rank == "J")
			{
				ranksOnly.push(11);
				
				if (smallest > 11)
				{
					smallest = 11;
				}
			}
			else if (group[i].rank == "A")
			{
				ranksOnly.push(1);
				
				if (smallest > 1)
				{
					smallest = 1;
				}
			}
			else
			{
				ranksOnly.push(parseInt(group[i].rank));
				
				if (smallest > group[i].rank)
				{
					smallest = parseInt(group[i].rank);
				}
			}
		}
		
		var count = 1;
		
		
	
	
		for (let i = smallest+1; i < 14; i++)
		{
			if (ranksOnly.indexOf(i) === -1)
			{
				if (count == group.length)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				count++;
			}
		}
		
		return true;
	}
	
	static isValidMatching(group)
	{
		var used_suits = [];
			var rank = group[0].rank;
			for (let i in group)
			{
				if (!(group[i].rank == rank && used_suits.indexOf(group[i].suit) === -1))
				{
					return false;
				}
			}
			
			return true;
	}
}
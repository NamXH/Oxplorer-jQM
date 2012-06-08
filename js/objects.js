// Mandant 
function Mandant(id, name, isAdded)
{
	this.id = id;
	this.name = name;
	this.isAdded = isAdded;
}

// WorkBasket
function Wb(id, type, lastBuildDate, mandantId, mandantName, groupId)
{
	this.id = id;
	this.type = type;
	this.lastBuildDate = lastBuildDate;
	
	this.mandantId = mandantId; // Mandant which the workbasket belongs to
	this.mandantName = mandantName; // Mandant which the workbasket belongs to
	this.groupId = groupId; // Group which the workbasket belongs to
}

// Group
function Group(name, id)
{
	this.name = name;
	this.id = id;
//	this.position = position; Dont need
}
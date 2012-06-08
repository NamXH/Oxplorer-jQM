// Index Controller

/*---------------- Global variables ---------------------------*/
var changedGroupId = "none"; // this var used in function setGroupName(). "none" - new group, "groupId" - change that group's name.
/*-------------------------------------------------------------*/

/*------------------------ #main_page -----------------------*/
function main()
{
	// Creat database
	getMandants();
	
	// Creat No Group for the first time running, initialize groupCount, wbCount
	init();
	
	// Draw dynamic content of main page
	drawMainPageDynamicContent();
	
}

function getMandants()
{
	if (localStorage.getItem("mandantOK") != "true") {
		// Set flag to indicate that mandants have been fetched to local storage
		localStorage.setItem("mandantOK", "true");
		
		// Get Mandants from somewhere on the Internet here //			
			// Demo			
		var mandantList = new Array();
		mandantList[1] = new Mandant(1, "one", false);
		mandantList[2] = new Mandant(2, "two", false);
		mandantList[3] = new Mandant(3, "three", false);
		mandantList[4] = new Mandant(4, "four", false);
		mandantList[5] = new Mandant(5, "five", false);
		mandantList[6] = new Mandant(6, "six", false);
		localStorage.setItem("mandantCount", "6");
			
		// Store Mandants into local storage	
		for (i = 1; i <= 6; i++)
		{
			setItemStorage("mandant", i , mandantList[i]);
		}
	}
}

function init()
{
	if (localStorage.getItem("groupOK") != "true") {
		localStorage.setItem("groupOK", "true");
		noGroup = new Group("No Group", "0000000000");	// 0000000000 is default Id for No Group
		setItemStorage("group", 1, noGroup);
		localStorage.setItem("groupCount", "1");		
	}
	
	if (localStorage.getItem("wbOK") != "true") {
		localStorage.setItem("wbOK", "true");
		localStorage.setItem("wbCount", "0");
	}
}

function drawMainPageDynamicContent()
{
	printGroups();
}

function printGroups()
{
	// Draw groups to place holder
	var groupCount = getCountStorage("group");
	for (i = 1; i <= groupCount; i++)
	{	
		// Get the groups from database
		var group = getItemStorage("group", i);
		
		var groupName = toUnderscore(group.name);
		var headerBarName = groupName + '_header_bar';
		var wbListName = groupName + "_wb_list";
		
		// Creat header bar of each groups with appropriate buttons
		
		$("#groups").append("<div id=" + headerBarName +" class='ui-bar ui-bar-b header_bar'></div>");
		
		$("#" + headerBarName).append("<span class='toggle_button'></span>");
		$("#" + headerBarName + " span:nth-child(1)").append("<button data-inline='true' data-icon='arrow-d' data-iconpos='notext' onClick='toggleList(\"" + wbListName + "\")'>");
		
		$("#" + headerBarName).append("<span class='group_name'>" + group.name + "</span>");	
		
		$("#" + headerBarName).append("<span class='edit_button'></span>");	
		if (group.name != "No Group") {
			$("#" + headerBarName + " span:nth-child(3)").append("<button data-inline='true' onClick='editGroupName(\"" + group.id + "\")'>Edit</button>");
		}
		$("#" + headerBarName).append("<span class='down_button'></span>");	
		$("#" + headerBarName + " span:nth-child(4)").append("<button data-iconpos='notext' data-icon='arrow-d' onClick='groupDown(\"" + group.id + "\")'>Down</button>");	
		
		$("#" + headerBarName).append("<span class='delete_button'></span>");
		if (group.name != "No Group") {
			$("#" + headerBarName + " span:nth-child(5)").append("<button data-iconpos='notext' data-icon='delete' onClick='deleteGroup(\"" + group.id + "\")'>Delete</button>");	
		}
		// Creat work basket list of each groups
		$("#groups").append("<div id=" + wbListName + " class='ui-body ui-body-c'></div>");
		$("#" + wbListName).append("<ul class='wb_ul' data-role='listview'></ul>");
		// Find appropriate work basket based on group Id
		var wbCount = getCountStorage("wb");
		var aWb;
		for (j = 1; j <= wbCount; j++)
		{
			aWb = getItemStorage("wb", j);
			if (aWb.groupId == group.id)
			{
				$("#" + wbListName + " ul").append("<li></li>");
				$("#" + wbListName + " ul li:last").append("<div></div>");
				$("#" + wbListName + " ul li:last div:first").append("<span class='wb_mandant_name'>" + aWb.mandantName + "<span>");
				$("#" + wbListName + " ul li:last div:first").append("<span class='wb_id'>" + aWb.id + "<span>");
				$("#" + wbListName + " ul li:last div:first").append("<span class='wb_unread'>0/2<span>");
				$("#" + wbListName + " ul li:last").append("<div>" + aWb.lastBuildDate + "</div>");
			}
		}
		//	$("#" + wbListName + " ul").listview("refresh");
	}
}


function toggleList(wbListName)
{
	$("#" + wbListName + " ul").toggle();
}

function editGroupName(groupId)
{
	changedGroupId = groupId;
	$.mobile.changePage("index.html#set_group_name", {		
		transition:"slideup",
		role:"dialog"
		});	
}

function groupDown(groupId)
{
	var groupCount = getCountStorage("group");
	var aGroup;
	
	for (i = 1; i < groupCount; i++)
	{
		aGroup = getItemStorage("group", i);
		if (aGroup.id == groupId)
		{
			var nextGroup = getItemStorage("group", i + 1);
			setItemStorage("group", i + 1, aGroup);
			setItemStorage("group", i , nextGroup);
			break;
		}
	}
	window.location.href="index.html";
}

function deleteGroup(groupId)
{
	// Move all wb in this group to No Group
	var wbCount = getCountStorage("wb");
	var aWb;
	for (i = 1; i <= wbCount; i++)
	{
		aWb = getItemStorage("wb", i);
		if (aWb.groupId == groupId)
		{
			// Change groupId to id of No Group
			aWb.groupId = "0000000000";
			setItemStorage("wb", i, aWb);
		}
	}
	
	// Delete this group
	var groupCount = getCountStorage("group");
	var aGroup;
	for (i = 1; i <= groupCount; i++)
	{
		aGroup = getItemStorage("group", i);
		if (aGroup.id == groupId)
		{
			for (j = i; j < groupCount; j++)
			{
				setItemStorage("group", j, getItemStorage("group", j + 1));
			}
			localStorage.removeItem("group[" + groupCount + "]");
			groupCount = decVar("groupCount", 1);
			break;
		}
	}
	window.location.href="index.html";
}
/*----------------------------------------------------------------------------------*/

/*---------------- #add_remove_mandants_page ------------------------*/
function addRemoveMandants()
{
	for (i = 1; i <= 6; i++)
	{
		var mandant = getItemStorage("mandant", i);
		if (mandant.isAdded == false) 
		{
			newMandant = document.createElement("button");
			newMandant.innerHTML = mandant.name + " - [Add]";
			newMandant.setAttribute("data-theme", "c");
			newMandant.setAttribute("data-index", i);
			newMandant.addEventListener("click", function(){addMandant(this)});
			$("#add_remove_mandants_list").append(newMandant);		
		}
		else 
		{
			newMandant = document.createElement("button");
			newMandant.innerHTML = mandant.name + " - [Remove]";
			newMandant.setAttribute("data-theme", "c");
			newMandant.setAttribute("data-index", i);
			newMandant.addEventListener("click", function(){removeMandant(this)});
			$("#add_remove_mandants_list").append(newMandant);					
		}
	}
}

function addMandant(obj)
{
	// Change the added status of that Mandant in localStorage	
	var i = obj.getAttribute("data-index");
	var mandant = getItemStorage("mandant", i);
	mandant.isAdded = true;
	setItemStorage("mandant", i , mandant);
	
	// Load WB of that mandant
	loadWb(mandant.id);
	
	window.location.href="index.html";
}

function removeMandant(obj)
{
	// Change the added status of that Mandant in localStorage	
	var i = obj.getAttribute("data-index");
	var mandant = getItemStorage("mandant", i);
	mandant.isAdded = false;	
	setItemStorage("mandant", i , mandant);	
	
	removeWb(mandant.id);
	
	window.location.href="index.html";
}

function loadWb(mandantId)
{
	// Get Wb info from somewhere based on mandantId
	var demoWb = {
		"id" : "something",
		"type" : "type1",
		"lastBuildDate" : "1 month ago"	
	}
	demoWb.id = mandantId;
	var	demoMandantId = mandantId;
	var demoMandantName = "[shf]";
			
	// Store Wb info to database
	var newWb = new Wb(demoWb.id, demoWb.type, demoWb.lastBuildDate, demoMandantId, demoMandantName, "0000000000");
	var wbCount = incVar("wbCount", 1);
	setItemStorage("wb", wbCount, newWb);
	
}

function removeWb(mandantId)
{
	var wbCount = getCountStorage("wb");
	var aWb;
	var k;
	
	var i = 1;
	while (i <= wbCount)
	{
		aWb = getItemStorage("wb", i);
		if (aWb.mandantId == mandantId)
		{
			for (j = i; j < wbCount; j++)
			{
				k = j + 1;
				nextWb = localStorage.getItem("wb[" + k + "]");
				localStorage.setItem("wb[" + j + "]", nextWb);
			}
			localStorage.removeItem("wb[" + wbCount + "]");
			wbCount = decVar("wbCount", 1);
		}
		else
		{
			i++;
		}
	}
	
	/*	QuickRemove algorithm but the order will be changed, so it is not good for user's experience
	
		var i = 1;
		while (i <= wbCount)
		{
			aWb = jQuery.parseJSON(localStorage.getItem("wb[" + i + "]"));
			if (aWb.mandantId == mandantId)
			{
				if (i < wbCount)
				{
					// Remove this Wb from local storage
					lastWb = localStorage.getItem("wb[" + wbCount + "]");	// Get the last Wb and put it in the position of this Wb
					localStorage.setItem("wb[" + i + "]", lastWb);
					localStorage.removeItem("wb[" + wbCount + "]");
					wbCount = decVar("wbCount", 1);
				}
				else
				{
					localStorage.removeItem("wb[" + wbCount + "]"); // i == wbCount
					wbCount = decVar("wbCount", 1);
				}
			}
			else 
			{
				i++;
			}
		}
	*/	
}
/*---------------------------------------------------------------------*/

/*--------------------- #set_group_name ------------------------------*/
function setGroupName()
{
	// Get the value in textbox
	var newGroupName = $("#new_group_name").val();
	
	// Change name or creat a new group
	if (changedGroupId == "none")
	{
		// Creat new group
		aGroup = new Group(newGroupName, makeId(10));
		var groupCount = incVar("groupCount", 1);
		setItemStorage("group", groupCount, aGroup);
		window.location.href="index.html";
	}
	else
	{
		// Change group name based on changedGroupId
		var groupCount = getCountStorage("group");
		var aGroup;
		for (i = 1; i <= groupCount; i++)
		{
			aGroup = getItemStorage("group", i);
			if (aGroup.id == changedGroupId)
			{
				aGroup.name = newGroupName;
				setItemStorage("group", i, aGroup);
				break;
			}
		}
		// set changedGroupId to its default value
		changedGroupId = "none";
		window.location.href="index.html";
	}
}
/*--------------------------------------------------------------------*/

/*------------------ Basic Functions -----------------------*/
function incVar(key, x)
{
	// Increase the value of the localStorage("key") by x and return the new value
	var t = localStorage.getItem(key);
	t = parseInt(t);
	t += x;
	localStorage.setItem(key, t);
	return t;
}

function decVar(key, x)
{
	// Decrease the value of the localStorage("key") by x and return the new value
	var t = localStorage.getItem(key);
	t = parseInt(t);
	t -= x;
	localStorage.setItem(key, t);
	return t;
}

function getItemStorage(key, index)
{
	// return an object of a list
	// key can be: group, mandant, wb
	return jQuery.parseJSON(localStorage.getItem(key + "[" + index + "]"));
}

function setItemStorage(key, index, object)
{
	// set an object to a list
	// key can be: group, mandant, wb
	localStorage.setItem(key + "[" + index + "]", JSON.stringify(object));
}

function getCountStorage(key)
{
	// return the number of items in a list
	// key can be: group, mandant, wb
	return parseInt(localStorage.getItem(key + "Count"));
}

function toUnderscore(str)
{
	return str.split(' ').join('_');
}

function makeId(numberOfChar)
{
	// Creat a random string of numberOfChar characters
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < numberOfChar; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
/*------------------------------------------------------------*/
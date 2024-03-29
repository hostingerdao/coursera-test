$(function () {
	$("#navbarToggle").blur(function(event)
	{
		var screenWidth = window.innerWidth;
		if (screenWidth < 768)
		{
			$("#collapsable-nav").collapse('hide');
		}
	});
});

// (function (global) {
// 	var dc = {};

// 	var homeHtml = "snippets/home-snippet.html";

// 	// Convinience function for inserting innerHTML for 'select'
// 	var insertHtml = function (selector, html) {
// 		var targetElem = document.querySelector(selector);
// 		targetElem.innerHTML = html;
// 	}

// 	// Show loading icon inside element identified by 'selector'
// 	var showLoading = function (selector) {
// 		var html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
// 		insertHtml(selector, html);
// 	}

// 	// On page load (before image or CSS)
// 	document.addEventListener("DOMContentLoaded", function (event) {

// 		// On first load, show home view
// 		showLoading("#main-content");
// 		$ajaxUtils.sendGetRequest(
// 			homeHtml,
// 			function (responseText) {
// 				document.querySelector("#main-content")
// 				.innerHTML = responseText;
// 			},
// 			false);
// 	});

// 	global.$dc = dc;

// })(window);

(function (global) {
	var dc = {};

	var homeHtml = "snippets/home-snippet.html";

	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitleHtml = "snippets/categories-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";

	var menuItemsUrl = "https://davids-restaurant.herokuapp.com/categories.json?category=";
	var menuItemsTitleHtml = "snippets/menu-item-title.html";
	var menuItemHtml = "snippets/menu-item.html";

	// Convinience function for inserting innerHTML for 'select'
	var insertHtml = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	}

	// Show loading icon inside element identified by 'selector'
	var showLoading = function (selector) {
		var html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	}

	//	Return substitute of '{{propName}}'
	//	with propValue in given 'string'
	var insertProperty = function (string, propName, PropValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace(new RegExp(propToReplace, "g"), PropValue);
		return string;
	}

	// Remove the class 'active' from home and switch to Menu button
	var switchMenuToActive = function () {
		// Remove 'active' from home button
		var classes = document.querySelector("#navHomeButton").className;
		classes = classes.replace(new RegExp("active", "g"), "");
		document.querySelector("#navHomeButton").className = classes;

		// Add 'active' to menu button if not already there
		classes = document.querySelector("#navMenuButton").className;
		if (classes.indexOf("active") == -1) {
			classes += " active";
			document.querySelector("#navMenuButton").className = classes;
		}
	}

	// On page load (before images or CSS)
	document.addEventListener("DOMContentLoaded", function (event) {
		// On first load, show home view
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			homeHtml,
			function (responseText) {
				document.querySelector("#main-content")
				.innerHTML = responseText;
			},
			false);
	});


	// Load the menu categories view (from another site)
	dc.loadMenuCategories = function () {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl,
			buildAndShowCategoriesHTML
			);
	}

	// Load the menu items view
	// 'categoryShort' is a short_name for a category
	dc.loadMenuItems = function (categoryShort) {
		showLoading("#main-content");
		$ajaxUtils.sendGetRequest(
			menuItemsUrl + categoryShort,
			buildAndShowMenuItemsHTML
			);
	}

	//	Builds HTML for the categories page based on the data
	//	from the server
	function buildAndShowCategoriesHTML (categories) {
		//	Load title snippet of categories page
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml, 
			function (categoriesTitleHtml) {
				// Retrieve single category snippet
				$ajaxUtils.sendGetRequest(
				categoryHtml, 
				function(categoryHtml) {
					var categoriesViewHtml =
					buildCategoriesViewHtml(categories,
						categoriesTitleHtml,
						categoryHtml);
					insertHtml("#main-content", categoriesViewHtml);
				}, 
				false);
			}, 
			false);
	}

	// Using categories data and snippets html
	// build categories view HTML to be inserted into page
	function buildCategoriesViewHtml (categories, 
										categoriesTitleHtml, 
											categoryHtml) {
		var finalHtml = categoriesTitleHtml;
		finalHtml += "<section class='row'>";

		// Loop over categories
		for (var i = 0; i < categories.length; i ++) {
			// Insert category values
			var html = categoryHtml;
			var name = "" + categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			finalHtml += html;
		}

		finalHtml += "</section>";
		return finalHtml;
	}

	//	Builds HTML for the single category page based on the data
	//	from the server
	function buildAndShowMenuItemsHTML (categoryMenuItems) {
		//	Load title snippet of menu items page
		$ajaxUtils.sendGetRequest(
			menuItemsTitleHtml, 
			function (menuItemsTitleHtml) {
				// Retrieve single category snippet
				$ajaxUtils.sendGetRequest(
				menuItemHtml, 
				function(menuItemHtml) {
					var menuItemsViewHtml =
					buildMenuItemsViewHtml(categoryMenuItems,
						menuItemsTitleHtml,
						menuItemHtml);
					insertHtml("#main-content", menuItemsViewHtml);
				}, 
				false);
			}, 
			false);
	}

	// function buildMenuItemsViewHtml (categoryMenuItems, 
	// 									menuItemsTitleHtml, 
	// 										menuItemHtml) {
	// 	menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
	// 			"name", categoryMenuItems.category.name);
	// 	menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
	// 						"special_instructions",
	// 						categoryMenuItems.category.special_instructions);

	// 	var finalHtml = menuItemsTitleHtml;
	// 	finalHtml += "<section class='row'>";

	// 	// Loop over categories
	// 	var menuItems = categoryMenuItems.menu_items;
	// 	var catShortName = categoryMenuItems.category.short_name;

	// 	for (var i = 0; i < menuItems.length; i ++) {
			
	// 		var html = menuItemHtml;
			
	// 		html = insertProperty(html, "short_name", menuItems[i].short_name);
	// 		html = insertProperty(html, "catShortName", catShortName);

	// 		html = insertItemPrice(html, "price_small", menuItems[i].price_small);
	// 		html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
			
	// 		html = insertItemPrice(html, "price_large", menuItems[i].price_large);
	// 		html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);

	// 		insertProperty(html, "name", menuItems[i].name);
	// 		insertProperty(html, "description", menuItems[i].description);

	// 		// Add clearfix
	// 		if (i % 2 != 0) {
	// 			html += "<div  class='clearfix visible-lg-block visible-md-block'></div>";
	// 		}

	// 		finalHtml += html;
	// 	} 

	// 	finalHtml += "</section>";
	// 	return finalHtml;
	// }
	function buildMenuItemsViewHtml (categoryMenuItems, 
										menuItemsTitleHtml, 
											menuItemHtml) {
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
				"name", categoryMenuItems[0].name);
		menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
							"special_instructions",
							categoryMenuItems[0].special_instructions);

		var finalHtml = menuItemsTitleHtml;
		finalHtml += "<section class='row'>";

		// Loop over categories
		var menuItems = categoryMenuItems;
		var catShortName = categoryMenuItems[0].short_name;

		for (var i = 0; i < menuItems.length; i ++) {
			
			var html = menuItemHtml;
			
			html = insertProperty(html, "short_name", menuItems[i].short_name);
			html = insertProperty(html, "catShortName", catShortName);
			if (menuItems[i].price_small == undefined || menuItems[i].small_portion_name == undefined) 
			{
				html = insertItemPrice(html, "price_small", null);
				html = insertItemPortionName(html, "small_portion_name", null);
			}
			else 
			{
				html = insertItemPrice(html, "price_small", menuItems[i].price_small);
				html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
			}

			if (menuItems[i].price_large == undefined || menuItems[i].large_portion_name == undefined) 
			{
				html = insertItemPrice(html, "price_large", null);
				html = insertItemPortionName(html, "large_portion_name", null);
			}
			else 
			{
				html = insertItemPrice(html, "price_large", menuItems[i].price_large);
				html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
			}

			insertProperty(html, "name", menuItems[i].name);
			insertProperty(html, "special_instructions", menuItems[i].special_instructions);

			// Add clearfix
			if (i % 2 != 0) {
				html += "<div  class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;
		} 

		finalHtml += "</section>";
		return finalHtml;
	}

	// Appends price with '$' if price exists
	function insertItemPrice(html, pricePropName, priceValue){
		// if no specified, repalce with empty string
		if (!priceValue) {
			return insertProperty(html, pricePropName, "");
		}

		priceValue = "$" + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	}

	// Appends portion name in parents if it exists
	function insertItemPortionName(html, portionPropName,
		portionValue)
	{
		if (!portionValue) {
			return insertProperty(html, portionPropName, "");
		}

		portionValue = "(" + portionValue + ")";
		html = insertProperty(html, portionPropName, portionValue);
		return html;
	}

	global.$dc = dc;

})(window);


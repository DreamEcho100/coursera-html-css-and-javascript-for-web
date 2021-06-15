$(() => {
	// Same as document.addEventListener("DOMContentLoaded"...

	// Same as document.querySelector("#navbarToggle").addEventListener("blur",...
	$('#navbarToggle').blur((event) => {
		const screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$('#collapsable-nav').collapse('hide');
		}
	});
});

((global) => {
	const dc = {};

	const homeHtmlUrl = 'snippets/home-snippet.html';
	const allCategoriesUrl =
		'https://davids-restaurant.herokuapp.com/categories.json';
	const categoriesTitleHtml = 'snippets/categories-title-snippet.html';
	const categoryHtml = 'snippets/category-snippet.html';
	const menuItemsUrl =
		'https://davids-restaurant.herokuapp.com/menu_items.json?category=';
	const menuItemsTitleHtml = 'snippets/menu-items-title.html';
	const menuItemHtml = 'snippets/menu-item.html';

	// Convenience function for inserting innerHTML for 'select'
	let insertHtml = (selector, html) => {
		const targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	// Show loading icon inside element identified by 'selector'.
	const showLoading = (selector) => {
		let html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};

	// Return substitute of '{{propName}}'
	// with propValue in given 'string'
	const insertProperty = function (string, propName, propValue) {
		const propToReplace = '{{' + propName + '}}';
		stringFormatted = string.replace(new RegExp(propToReplace, 'g'), propValue);
		return stringFormatted;
	};

	// Remove the class 'active' from home and switch to Menu button
	const switchMenuToActive = () => {
		// Remove 'active' from home button
		let classes = document.querySelector('#navHomeButton').className;
		classes = classes.replace(new RegExp('active', 'g'), '');
		document.querySelector('#navHomeButton').className = classes;

		// Add 'active' to menu button if not already there
		classes = document.querySelector('#navMenuButton').className;
		if (classes.indexOf('active') === -1) {
			classes += ' active';
			document.querySelector('#navMenuButton').className = classes;
		}
	};

	// On page load (before images or CSS)
	document.addEventListener('DOMContentLoaded', function (event) {
		// TODO: STEP 0: Look over the code from
		// *** start ***
		// to
		// *** finish ***
		// below.
		// We changed this code to retrieve all categories from the server instead of
		// simply requesting home HTML snippet. We now also have another function
		// called buildAndShowHomeHTML that will receive all the categories from the server
		// and process them: choose random category, retrieve home HTML snippet, insert that
		// random category into the home HTML snippet, and then insert that snippet into our
		// main page (index.html).
		//
		// TODO: STEP 1: Substitute [...] below with the *value* of the function buildAndShowHomeHTML,
		// so it can be called when server responds with the categories data.

		// *** start ***
		// On first load, show home view
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl,
			buildAndShowHomeHTML, // ***** <---- TODO: STEP 1: Substitute [...] ******
			true
		); // Explicitely setting the flag to get JSON from server processed into an object literal
	});
	// *** finish **

	// Builds HTML for the home page based on categories array
	// returned from the server.
	const buildAndShowHomeHTML = (categories) => {
		// Load home snippet page
		$ajaxUtils.sendGetRequest(
			homeHtmlUrl,
			(homeHtml) => {
				// TODO: STEP 2: Here, call chooseRandomCategory, passing it retrieved 'categories'
				// Pay attention to what type of data that function returns vs what the chosenCategoryShortName
				// letiable's name implies it expects.
				// let chosenCategoryShortName = ....
				let chosenCategoryShortName =
					chooseRandomCategory(categories).short_name;

				// TODO: STEP 3: Substitute {{randomCategoryShortName}} in the home html snippet with the
				// chosen category from STEP 2. Use existing insertProperty function for that purpose.
				// Look through this code for an example of how to do use the insertProperty function.
				// WARNING! You are inserting something that will have to result in a valid Javascript
				// syntax because the substitution of {{randomCategoryShortName}} becomes an argument
				// being passed into the $dc.loadMenuItems function. Think about what that argument needs
				// to look like. For example, a valid call would look something like this:
				// $dc.loadMenuItems('L')
				// Hint: you need to surround the chosen category short name with something before inserting
				// it into the home html snippet.
				//
				// let homeHtmlToInsertIntoMainPage = ....
				chosenCategoryShortName = "'" + chosenCategoryShortName + "'";
				let homeHtmlToInsertIntoMainPage = insertProperty(
					homeHtml,
					'randomCategoryShortName',
					chosenCategoryShortName
				);

				// TODO: STEP 4: Insert the the produced HTML in STEP 3 into the main page
				// Use the existing insertHtml function for that purpose. Look through this code for an example
				// of how to do that.
				// ....
				insertHtml('#main-content', homeHtmlToInsertIntoMainPage);
			},
			false
		); // False here because we are getting just regular HTML from the server, so no need to process JSON.
	};

	// Given array of category objects, returns a random category object.
	function chooseRandomCategory(categories) {
		// Choose a random index into the array (from 0 inclusively until array length (exclusively))
		const randomArrayIndex = Math.floor(Math.random() * categories.length);

		// return category object with that randomArrayIndex
		return categories[randomArrayIndex];
	}

	// Load the menu categories view
	dc.loadMenuCategories = () => {
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
	};

	// Load the menu items view
	// 'categoryShort' is a short_name for a category
	dc.loadMenuItems = (categoryShort) => {
		showLoading('#main-content');
		$ajaxUtils.sendGetRequest(
			menuItemsUrl + categoryShort,
			buildAndShowMenuItemsHTML
		);
	};

	// Builds HTML for the categories page based on the data
	// from the server
	const buildAndShowCategoriesHTML = (categories) => {
		// Load title snippet of categories page
		$ajaxUtils.sendGetRequest(
			categoriesTitleHtml,
			(categoriesTitleHtml) => {
				// Retrieve single category snippet
				$ajaxUtils.sendGetRequest(
					categoryHtml,
					(categoryHtml) => {
						// Switch CSS class active to menu button
						switchMenuToActive();

						let categoriesViewHtml = buildCategoriesViewHtml(
							categories,
							categoriesTitleHtml,
							categoryHtml
						);
						insertHtml('#main-content', categoriesViewHtml);
					},
					false
				);
			},
			false
		);
	};

	// Using categories data and snippets html
	// build categories view HTML to be inserted into page
	const buildCategoriesViewHtml = (
		categories,
		categoriesTitleHtml,
		categoryHtml
	) => {
		let finalHtml = categoriesTitleHtml;
		finalHtml += "<section class='row'>";

		// Loop over categories
		let i;
		for (i = 0; i < categories.length; i++) {
			// Insert category values
			let html = categoryHtml;
			let name = '' + categories[i].name;
			let short_name = categories[i].short_name;
			html = insertProperty(html, 'name', name);
			html = insertProperty(html, 'short_name', short_name);
			finalHtml += html;
		}

		finalHtml += '</section>';
		return finalHtml;
	};

	// Builds HTML for the single category page based on the data
	// from the server
	const buildAndShowMenuItemsHTML = (categoryMenuItems) => {
		// Load title snippet of menu items page
		$ajaxUtils.sendGetRequest(
			menuItemsTitleHtml,
			(menuItemsTitleHtml) => {
				// Retrieve single menu item snippet
				$ajaxUtils.sendGetRequest(
					menuItemHtml,
					(menuItemHtml) => {
						// Switch CSS class active to menu button
						switchMenuToActive();

						let menuItemsViewHtml = buildMenuItemsViewHtml(
							categoryMenuItems,
							menuItemsTitleHtml,
							menuItemHtml
						);
						insertHtml('#main-content', menuItemsViewHtml);
					},
					false
				);
			},
			false
		);
	};

	// Using category and menu items data and snippets html
	// build menu items view HTML to be inserted into page
	const buildMenuItemsViewHtml = (
		categoryMenuItems,
		menuItemsTitleHtml,
		menuItemHtml
	) => {
		menuItemsTitleHtml = insertProperty(
			menuItemsTitleHtml,
			'name',
			categoryMenuItems.category.name
		);
		menuItemsTitleHtml = insertProperty(
			menuItemsTitleHtml,
			'special_instructions',
			categoryMenuItems.category.special_instructions
		);

		let finalHtml = menuItemsTitleHtml;
		finalHtml += "<section class='row'>";

		// Loop over menu items
		const menuItems = categoryMenuItems.menu_items;
		const catShortName = categoryMenuItems.category.short_name;
		let i;
		for (i = 0; i < menuItems.length; i++) {
			// Insert menu item values
			let html = menuItemHtml;
			html = insertProperty(html, 'short_name', menuItems[i].short_name);
			html = insertProperty(html, 'catShortName', catShortName);
			html = insertItemPrice(html, 'price_small', menuItems[i].price_small);
			html = insertItemPortionName(
				html,
				'small_portion_name',
				menuItems[i].small_portion_name
			);
			html = insertItemPrice(html, 'price_large', menuItems[i].price_large);
			html = insertItemPortionName(
				html,
				'large_portion_name',
				menuItems[i].large_portion_name
			);
			html = insertProperty(html, 'name', menuItems[i].name);
			html = insertProperty(html, 'description', menuItems[i].description);

			// Add clearfix after every second menu item
			if (i % 2 !== 0) {
				html +=
					"<div class='clearfix visible-lg-block visible-md-block'></div>";
			}

			finalHtml += html;
		}

		finalHtml += '</section>';
		return finalHtml;
	};

	// Appends price with '$' if price exists
	const insertItemPrice = (html, pricePropName, priceValue) => {
		// If not specified, replace with empty string
		if (!priceValue) {
			return insertProperty(html, pricePropName, '');
		}

		priceValue = '$' + priceValue.toFixed(2);
		html = insertProperty(html, pricePropName, priceValue);
		return html;
	};

	// Appends portion name in parens if it exists
	const insertItemPortionName = (html, portionPropName, portionValue) => {
		// If not specified, return original string
		if (!portionValue) {
			return insertProperty(html, portionPropName, '');
		}

		portionValue = '(' + portionValue + ')';
		html = insertProperty(html, portionPropName, portionValue);
		return html;
	};

	global.$dc = dc;
})(window);

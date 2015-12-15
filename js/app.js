// MVVM for managing locations using Knockout.js

'use strict';
 var locationsList = [
	{name: 'Springfield Town Center', location: {lat: 38.7745955, lng: -77.1736186}},
	{name: 'Tysons Corner Center', location: {lat: 38.917367, lng: -77.220867}},
	{name: 'Virginia Center Commons', location: {lat: 37.6759852, lng: -77.4542402}},
	{name: 'New River Valley Mall', location: {lat: 37.1653194, lng: -80.427784}},
	{name: 'Virginia Beach', location: {lat: 36.8529263, lng: -75.977985}},
	
];
// sort list alphabetically
locationsList.sort(function(a, b) {
	var x = a.name.toLowerCase();
	var y = b.name.toLowerCase();
	return x < y ? -1 : x > y ? 1 : 0;
});

// location class
var Location = function(item) {
	this.name = ko.observable(item.name);
	this.location = ko.observable(item.location);
	this.marker = ko.observable();
};

// location viewmodel class
var LocationViewModel = function() {

	var self = this;

	// array of locations
	this.locations = ko.observableArray();
	locationsList.forEach(function(item) {
		var location = new Location(item);
		location.display = ko.observable(true);
		self.locations.push(location);
	});

	// store currently selected location
	this.currentLocation = ko.observable();

	// callback when a location in the list is clicked
	this.locationClicked = function(loc) {

		// set current location
		self.currentLocation(loc);

		// click associated marker to trigger all the info load
		mapView.clickMarker(loc.marker());

		// auto-hide sidebar if screen size is small
		if (window.innerWidth < 500) {
			$("#hamburger").click();
		}

	};

	// filter
	this.filter = ko.observable();
	this.filter.subscribe(function(val) {

		self.locations().forEach(function(loc) {

			// set display variable
			var shouldDisplay = loc.name().toLowerCase().search(val.toLowerCase()) != -1;
			loc.display(shouldDisplay);

			// set visibility of associated marker
			mapController.setMarkerVisibility(loc.marker(), shouldDisplay);

			// if current location is not in the filter list anymore, remove animation and info
			if (!shouldDisplay && self.currentLocation() === loc) {

				// clear marker state
				mapController.setMarkerSelected(loc.marker(), false);

				// empty current location
				self.currentLocation(null);
			}
		});

		// ask map to refresh
		mapView.refresh();

	});

};

// bind viewmodel to knockout
var locationViewModel = new LocationViewModel();
ko.applyBindings(locationViewModel);
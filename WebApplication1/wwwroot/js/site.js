// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    getCityFromLatAndLon(position.coords.latitude, position.coords.longitude);
}

function getCityFromLatAndLon(latitude, longitude) {
    var ulCities = $('#ulCities');
    $.ajax({
        type: 'GET',
        url: 'https://developers.zomato.com/api/v2.1/cities?lat=' + latitude + '&lon=' + longitude + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
        dataType: 'json',
        success: function (data) {
            ulCities.empty();
            $.each(data.location_suggestions, function (index, location_suggestions) {
                if (location_suggestions != undefined) {
                    ulCities.append('<a href="/getRestaurant/' + location_suggestions.id + '><li id="' + location_suggestions.id + '">' + location_suggestions.name + '</li></a>');
                }
            });
        }
    });
}

$("#btnSearchCities").click(function () {
    var city = $('#searchCityInput').val();
    var ulCities = $('#ulCities');
    
    $.ajax({
        type: 'GET',
        url: 'https://developers.zomato.com/api/v2.1/cities?q=' + city + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
        dataType: 'json',
        success: function (data) {
            ulCities.empty();
            $.each(data.location_suggestions, function (index, location_suggestions) {
                if (location_suggestions != undefined) {
                    ulCities.append('<li id="' + location_suggestions.id + '">' + location_suggestions.name + '</li>');
                }
            });
        }
    });
});

$("#btnGetNearby").click(function () {
    
    var ulCities = $('#ulCities');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(latsAndLons);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    function latsAndLons(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var restaurants = $('#restaurants');
        $.ajax({
            type: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/geocode?lat=' + latitude + '&lon=' + longitude + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
            dataType: 'json',
            data: JSON.stringify(),  
            success: function (data) {
                restaurants.empty();
                var i = 0;
                $.each(data, function (key, val) {
                    
                    restaurants.append(
                        '<h3 class="card-header">' + data.nearby_restaurants[i].restaurant.name + '</h3>' +
                        '<div class="card-body">' +
                        '<h5 class="card-title">Rating: ' + data.nearby_restaurants[i].restaurant.user_rating.aggregate_rating + '</h5>' +
                        '<h6 class="card-subtitle text-muted">' + data.nearby_restaurants[i].restaurant.cuisines + '</h6>' +
                        '</div>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style="font-size:1.125rem;text-anchor:middle">' +
                            '<rect width="100%" height="100%" fill="#868e96"></rect>' +
                            '<text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>' +
                        '</svg>' +
                        '<div class="card-body">' +
                            '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>' +
                        '</div>' +
                        '<ul class="list-group list-group-flush">' +
                        '<li class="list-group-item">' + data.nearby_restaurants[i].restaurant.location.address + '</li>' +
                        '<li class="list-group-item">' + data.nearby_restaurants[i].restaurant.location.city + '</li>' +
                        '<li class="list-group-item">' + data.nearby_restaurants[i].restaurant.location.zipcode + '</li>' +
                       '</ul>' +
                        '<div class="card-body">' +
                        '<a href="' + data.nearby_restaurants[i].restaurant.menu_url + '" class="card-link">View Menu</a>' +
                            '<a href="#" class="card-link">Another link</a>' +
                        '</div>' +
                        '<div class="card-footer text-muted mb-5">' +
                                                '2 days ago' +
                        '</div>');
                    i++;
                });
                
                
            }
        });
    }
});

$(".clear-results").click(function () {
    var restaurants = $('#restaurants');
    restaurants.empty();
    restaurants.append('<div class="icon-wrapper d-flex justify-content-center align-items-center">' +
        '<i class= "fas fa-utensils fa-9x search-icon" ></i>' +
        '</div>');
    $('#searchInput').val('');
});

$(".asc").click(function () {
    $('.asc').toggleClass('selected');
    $('.dsc').removeClass('selected');
});

$(".dsc").click(function () {
    $('.dsc').toggleClass('selected');
    $('.asc').removeClass('selected');
});

$("#btnSearch").click(function () {
    var q = $('#searchInput').val();
    $('.icon-wrapper').hide();
    var distance = $('#distance').val();
    var sort = $('#sort').val();
    var order = '';
    if ($('.asc').hasClass('selected')) {
        order = 'asc';
    }
    else if ($('.dsc').hasClass('selected')) {
        order = 'desc';
    }
    else {
        order = '';
    }

    console.log(distance);
    var ulCities = $('#ulCities');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(latsAndLons);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    function latsAndLons(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);
        var restaurants = $('#restaurants');
        $.ajax({
            type: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/search?q=' + q + '&lat=' + latitude + '&lon=' + longitude + '&radius=' + distance + '&sort=' + sort + '&order=' + order + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
            dataType: 'json',
            data: JSON.stringify(),
            success: function (data) {
                restaurants.empty();
                var i = 0;
                $.each(data.restaurants, function (key, val) {

                    restaurants.append(
                        '<h3 class="card-header">' + data.restaurants[i].restaurant.name + '</h3>' +
                        '<div class="card-body">' +
                        '<h5 class="card-title">Rating: ' + data.restaurants[i].restaurant.user_rating.aggregate_rating + '</h5>' +
                        '<h6 class="card-subtitle text-muted">' + data.restaurants[i].restaurant.cuisines + '</h6>' +
                        '</div>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style="font-size:1.125rem;text-anchor:middle">' +
                        '<rect width="100%" height="100%" fill="#868e96"></rect>' +
                        '<text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>' +
                        '</svg>' +
                        '<div class="card-body">' +
                        '<p class="card-text">' + data.restaurants[i].restaurant.highlights + '</p>' +
                        '</div>' +
                        '<ul class="list-group list-group-flush">' +
                        '<li class="list-group-item"><i class="fas fa-location-arrow"></i> ' + data.restaurants[i].restaurant.location.address + '</li>' +
                        '<li class="list-group-item"><i class="fas fa-cocktail"></i> ' + data.restaurants[i].restaurant.timings + '</li>' +
                        '<li class="list-group-item"><i class="fas fa-phone-square"></i> ' + data.restaurants[i].restaurant.phone_numbers + '</li>' +
                        '</ul>' +
                        '<div class="card-body">' +
                        '<a href="' + data.restaurants[i].restaurant.menu_url + '" class="card-link" target="_blank">View Menu</a>' +
                        '</div>' +
                        '<div class="card-footer text-muted mb-5">' +
                        '</div>');
                    i++;
                });


            }
        });
    }
});

//function filterCities() {
//    // Declare variables
//    var input, filter, ul, li, a, i, txtValue;
//    input = document.getElementById('searchCityInput');
//    filter = input.value.toUpperCase();
//    ul = document.getElementById("ulCities");
//    li = ul.getElementsByTagName('li');

//    // Loop through all list items, and hide those who don't match the search query
//    for (i = 0; i < li.length; i++) {
//        a = li[i].getElementsByTagName("a")[0];
//        txtValue = a.textContent || a.innerText;
//        if (txtValue.toUpperCase().indexOf(filter) > -1) {
//            li[i].style.display = "";
//        } else {
//            li[i].style.display = "none";
//        }
//    }
//}

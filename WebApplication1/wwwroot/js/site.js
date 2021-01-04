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

$(document).ready(function () {
    $('.icon-wrapper').hide();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(latsAndLons);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    function latsAndLons(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var neighborhood = $('#neighborhood');
        $.ajax({
            type: 'GET',
            url: 'https://developers.zomato.com/api/v2.1/collections?q=' + '&lat=' + latitude + '&lon=' + longitude + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
            dataType: 'json',
            data: JSON.stringify(),
            success: function (data) {
                neighborhood.empty();
                var i = 0;
                $.each(data.collections, function (key, val) {
                    
                    neighborhood.append(
                        '<h3 class="card-header"><a href="' + data.collections[i].collection.url + '" target="_blank">' + data.collections[i].collection.title + '</a></h3>' +
                        '<div class="card-body">' +
                        '<a href="' + data.collections[i].collection.url + '" target="_blank"><img id="collections-image" src="' + data.collections[i].collection.image_url + '"/></a>' +
                        '</div>' +
                        '<div class="card-body">' +
                        '<p class="card-text"><a href="' + data.collections[i].collection.url + '" target="_blank">' + data.collections[i].collection.description + '</a></p>' +
                        '</div>' +
                        '<div class="card-footer-h">' +
                        '</div>' +
                        '<div class="card-footer mb-5">' +
                        
                        '</div>');
                    i++;
                });
            }
        });
    }
});

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
    var nextBtn = $('.next-button');
    nextBtn.empty();
    restaurants.empty();
    restaurants.append('<div class="icon-wrapper d-flex justify-content-center align-items-center">' +
        '<i class= "fas fa-utensils fa-9x search-icon" ></i>' +
        '</div>');
    $('#searchInput').val('');
    $('#viewNext').toggleClass('hidden');
    $('#neighborhood').show();
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
    $('#neighborhood').hide();
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
            url: 'https://developers.zomato.com/api/v2.1/search?q=' + q + '&lat=' + latitude + '&lon=' + longitude + '&radius=' + distance + '&sort=' + sort + '&order=' + order + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
            dataType: 'json',
            data: JSON.stringify(),
            success: function (data) {
                restaurants.empty();
                var i = 0;
                $.each(data.restaurants, function (key, val) {
                    if (data.restaurants[i].restaurant.price_range) {
                        var price = data.restaurants[i].restaurant.price_range;
                        price = calcPrice(price);                                             
                    }
                    if (data.restaurants[i].restaurant.location.latitude && data.restaurants[i].restaurant.location.longitude) {
                        var lat1 = latitude;
                        var lon1 = longitude;
                        var lat2 = data.restaurants[i].restaurant.location.latitude;
                        var lon2 = data.restaurants[i].restaurant.location.longitude;
                        var dist = calcDistance(lat1, lon1, lat2, lon2, "M"); 
                    }
                   
                    restaurants.append(
                        '<h3 class="card-header"><a class="restaurant-details" id="' + data.restaurants[i].restaurant.id + '" data-toggle="modal" data-target="#resDetailModal">' + data.restaurants[i].restaurant.name + '</a></h3>' +
                        '<div class="card-body">' +
                    
                        '<h5 class="card-title">Rating: ' + data.restaurants[i].restaurant.user_rating.aggregate_rating + ' of 5</h5>' +
                        '<h5 class="card-title">Price: <span style="cursor:pointer" data-toggle="tooltip" title="Average cost for two: $' + data.restaurants[i].restaurant.average_cost_for_two + '">' + price + '</span></h5>' +
                        '<h6 class="card-subtitle text-muted">' + data.restaurants[i].restaurant.cuisines + '</h6>' +
                        '</div>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style="font-size:1.125rem;text-anchor:middle">' +
                        '<rect width="100%" height="100%" fill="#868e96"></rect>' +
                        '<text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>' +
                        '</svg>' +
                        '<div class="card-body">' +
                        '<p class="card-text">' + data.restaurants[i].restaurant.highlights + '</p>' +
                        '</div>' +                      
                        '<div class="card-footer-h">' +
                        i +
                        '</div>' +
                        '<div class="card-footer mb-5"><i class="fas fa-map-signs"></i> ' +
                            dist + ' Miles' +
                        '</div>');
                    i++;
                });


            }
        });
    }
    setTimeout(function () {
        $('#viewNext').removeClass('hidden');
    }, 2000)
});

$("#viewNext").click(function () {
    var start = $('.card-footer-h:last').text();
    start = parseInt(start);
    start++;
    var count = 20;
    var index = $('.card-footer-h:last').text();
    index = parseInt(index);
    index++;
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
            url: 'https://developers.zomato.com/api/v2.1/search?q=' + q + '&start=' + start + '&count=' + count + '&lat=' + latitude + '&lon=' + longitude + '&radius=' + distance + '&sort=' + sort + '&order=' + order + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
            dataType: 'json',
            data: JSON.stringify(),
            success: function (data) {
                
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
                        '<div class="card-footer mb-5">' +
                            index +
                        '</div>');
                    i++;
                    index++;
                });
            }
        });
    }
});

$(document).on("click", ".restaurant-details", function (e) {
    var resId = $(this).attr('id');
    console.log($(this).val());
    var title = $('#modal-title');
    var businessDetails = $('#business-details');
    var thumb = $('#thumb');
    var footer = $('.modal-footer-details');
    $.ajax({
        type: 'GET',
        url: 'https://developers.zomato.com/api/v2.1/restaurant?res_id=' + resId + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
        dataType: 'json',
        success: function (data) {
            title.empty();
            businessDetails.empty();
            thumb.empty(); 
            footer.empty();
            title.append(data.name);
            businessDetails.append(
                '<ul class="list-group list-group-flush">' +
                '<li class="list-group-item"><i class="fas fa-location-arrow"></i> ' + data.location.address + '</li>' +
                '<li class="list-group-item"><i class="fas fa-cocktail"></i> ' + data.timings + '</li>' +
                '<li class="list-group-item"><i class="fas fa-phone-square"></i> ' + data.phone_numbers + '</li>' +
                '<li class="list-group-item"><i class="fas fa-book-reader"></i><a href="' + data.menu_url + '" class="card-link" target="_blank"> View Menu</a></li>' +
                '</ul>'
            );
            thumb.append('<img src="' + data.featured_image + '"/>');
            footer.append('<a class="get-reviews" id="' + data.id + '">Reviews</a>');
        }
    });
    $("#resDetailModal").modal('show');     
});

$(document).on("click", ".get-reviews", function (e) {
    $("#resDetailModal").modal('hide');  
    var resId = $(this).attr('id');
    var reviews = $('#restaurant-reviews');
    reviews.empty();
    var thumb = $('#thumb');
    var backToRes = $('#back-to-restaurant');
    backToRes.empty();
    var i = 0;
    $.ajax({
        type: 'GET',
        url: 'https://developers.zomato.com/api/v2.1/reviews?res_id=' + resId + '&apikey=8e433de61020f20ecdcc1389db0f22a4',
        dataType: 'json',
        success: function (data) {
            $.each(data.user_reviews, function (key, val) {
                thumb.empty();
                console.log('success');
                console.log(data.user_reviews[i]);
                reviews.append(
                    '<div class="card border-primary mb-3">' +
                    '<div class="card-header">Rating: ' + data.user_reviews[i].review.rating + '</div>' +
                        '<div class="card-body">' +
                            '<h6 class="text-muted">Date: ' + data.user_reviews[i].review.review_time_friendly + '</h6>' +
                            '<h6 class="text-muted">Author: ' + data.user_reviews[i].review.user.name + '</h6>' +
                            '<p class="card-text">' + data.user_reviews[i].review.review_text + '</p > ' +
                    '</div>' +
                    '</div>');
                i++;
            });        
        }
    });
    backToRes.append('<a id="back">Back</a>');
    $("#resReviewModal").modal('show');
});

$(document).on("click", "#back", function (e) {
    $("#resReviewModal").modal('hide');
    $("#resDetailModal").modal('show');
});

function calcPrice(price) {
    switch (price) {
        case 1:
            // code block
            price = "$";
            break;
        case 2:
            // code block
            price = "$$";
            break;
        case 3:
            // code block
            price = "$$$";
            break;
        case 4:
            // code block
            price = "$$$$";
            break;
        default:
            // code block
            price = "$";
    } 
    return price;
}

function calcDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344; }
    if (unit == "N") { dist = dist * 0.8684; }
    if (unit == "M") { dist = dist.toFixed(2); }
    return dist;
}

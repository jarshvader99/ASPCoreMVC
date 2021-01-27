// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

//check to see if users location is in session still if not force user to update
$(window).on('load', function () {
    $.ajax({
        type: 'GET',
        url: '/Home/GetUserLocation',
        success: function (response) {
            console.log(response);
            if (response.value != null) {
                if (response.value == "success") {
                    $('#locationModal').modal('hide');
                }
                else
                {
                    $('#locationModal').modal('show');
                }
            } else {
                alert("Something went wrong");
            }
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }

    });
});
// Call to store user location in session
$("#show-res").click(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(latsAndLons);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    function latsAndLons(position) {
        $.ajax({
            type: 'POST',
            url: '/Home/StoreUserLocation',
            data: { 'latitude': position.coords.latitude, 'longitude': position.coords.longitude},
            success: function (data) {
                if (data != null) {
                    $('#locationModal').modal('hide');
                } else {
                    alert("Something went wrong");
                }
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
});
// Error getting location
function positionError(position) {
    alert("Opps! Error: " + postion.code);
}
// Call to search more
$("#load-more-search").click(function () {
    var q = GetURLParameter('q');
    var distance = GetURLParameter('distance');
    var sort = GetURLParameter('sort');
    var order = GetURLParameter('order');
    var start = parseInt($('.result-start').data('rs'));
    var loadMoreSearch = $('.load-more-search');
    $.ajax({
        type: 'GET',
        url: '/Home/SearchMore?=q' + q + '&distance=' + distance + '&sort=' + sort + '&order=' + order + '&start=' + (start + 20),
        success: function (response) {
            $('.result-start').data('rs', response.results_start);
            if (response) {
                var i = 0;
                var image = "";
                if (response.restaurants[i].restaurant.featured_image != "") {
                    image = response.restaurants[i].featured_image;
                }
                else {
                    image = "https://via.placeholder.com/380x253.png?text=Oops!+There+Is+Nothing+Here.";
                }
                $.each(response.restaurants, function (key, val) {
                    $('.newFromSearch').css('background-image', 'url(' + image + ')');
                    loadMoreSearch.append(
                        '<div class="col-lg-6 col-md-6 col-sm-6">' +
                        '<div class="categories__post__item">' +
                        '<div class="categories__post__item__pic small__item newFromSearch" style=background-image:("' + image + '")>' +
                        '<div class="post__meta">' +
                        '<span class="rating">Price</span>' +
                        '<h4>' + response.restaurants[i].restaurant.price_range + '</h4>' +
                        '<span class="rating">Rating</span>' +
                        '<h4>' + response.restaurants[i].restaurant.user_rating.aggregate_rating + '</h4>' +
                        '</div>' +
                        '</div>' +
                        '<div class="categories__post__item__text">' +
                        '<h3><a href=' + response.restaurants[i].restaurant.url + '>' + response.restaurants[i].restaurant.name + '</a></h3>' +
                        '<p class="post__label">' + response.restaurants[i].restaurant.cuisines + '</p>' +
                        '<p class="text-left"><i class="fa fa-hourglass-1"></i> ' + response.restaurants[i].restaurant.timings + '</p>' +
                        '<p class="text-left"><i class="fa fa-phone"></i> ' + response.restaurants[i].restaurant.phone_numbers + '</p>' +
                        '<p class="text-left"><i class="fa fa-address-book"></i> ' + response.restaurants[i].restaurant.location.address + '</p>' +
                        '<p class="text-left"><i class=" fa fa-map-signs"></i> ' + response.restaurants[i].restaurant.location.city + '</p>' +
                        '<p class="text-left"><i class=" fas fa-comments"></i> <a href="/Reviews?res_id=' + response.restaurants[i].restaurant.id + '">Reviews</a></p>')
                    i++;
                });
            } else {
                alert("Something went wrong");
            }
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
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

$(".close-login").click(function () {
    document.location.href = '/';
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
                        '<div class="card mb-3 pt-1"><h3 class="card-header"><a class="restaurant-details" id="' + data.restaurants[i].restaurant.id + '" data-toggle="modal" data-target="#resDetailModal">' + data.restaurants[i].restaurant.name + '</a></h3>' +
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
                        '</div></div>');
                    i++;
                });


            }
        });
    }
    setTimeout(function () {
        $('#viewNext').removeClass('hidden');
    }, 2000)
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

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
};

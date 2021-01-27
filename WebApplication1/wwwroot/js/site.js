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

$(".close-login").click(function () {
    document.location.href = '/';
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

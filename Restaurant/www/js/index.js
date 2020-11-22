document.addEventListener("deviceready", onDeviceReady, false);

var db = "";

function restaurantDB(tx) {
    tx.executeSql(`create table if not exists Restaurant
                   (
                       restaurantId   integer primary key autoincrement,
                       restaurantName text     not null,
                       restaurantType text     not null,
                       visitDate      text     not null default current_timestamp,
                       mealPrice      interger not null,
                       avgRating      interger not null,
                       Note           text,
                       reporterName   text     not null
                   )`
    );

}


function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}


function successCB() {
    console.log("alo alo")
}


function onDeviceReady() {
    db = window.openDatabase("Restaurant", "1.0", "Restaurant", 200000)
    db.transaction(restaurantDB, errorCB, successCB);
}

function insertRestaurant(restaurant) {
    db.transaction(function (tx) {
        var query = `insert into Restaurant(restaurantName,
                                            restaurantType,
                                            visitDate,
                                            mealPrice,
                                            avgRating,
                                            Note,
                                            reporterName) Values(?,?,?,?,?,?,?)`
        tx.executeSql(query, [restaurant.restaurantName,
            restaurant.restaurantType,
            restaurant.visitDate,
            restaurant.mealPrice,
            restaurant.avgRating,
            restaurant.Note,
            restaurant.reporterName], function () {
            console.log("insert done");
        }, errorCB)
    })
}

$("#frm-create-restaurant").submit(function (e) {
    e.preventDefault();
    let restaurantName = $("#txt-restaurant-name").val();
    let restaurantType = $("#txt-restaurant-type").val();
    let visitDate = $("#datetime-visit-time").val();
    let mealPrice = parseInt($("#txt-meal-price").val());
    let avgRating = (parseInt($("#txt-service-rating").val()) + parseInt($("#txt-cleanliness-rating").val()) + parseInt($("#txt-food-rating").val())) / 3;
    let Note = $("#txt-Notes").val();
    let reporterName = $("#txt-reporter").val();
    $("#frm-confirm #name").text(restaurantName);
    $("#frm-confirm #restaurantType").text(restaurantType);
    $("#frm-confirm #time").text(visitDate);
    $("#frm-confirm #mealPrice").text(mealPrice);
    $("#frm-confirm #averageRate").text(avgRating);
    $("#frm-confirm #note").text(Note);
    $("#frm-confirm #reporter").text(reporterName);
    $("#frm-confirm").popup("open");

});
$('#frm-confirm').submit(function (e) {
    e.preventDefault();
    let restaurantName = $("#txt-restaurant-name").val();
    let restaurantType = $("#txt-restaurant-type").val();
    let visitDate = $("#datetime-visit-time").val();
    let mealPrice = parseInt($("#txt-meal-price").val());
    let avgRating = (parseInt($("#txt-service-rating").val()) + parseInt($("#txt-cleanliness-rating").val()) + parseInt($("#txt-food-rating").val())) / 3;
    let Note = $("#txt-Notes").val();
    let reporterName = $("#txt-reporter").val();
    var restaurant = {
        "restaurantName": restaurantName,
        "restaurantType": restaurantType,
        "visitDate": visitDate,
        "mealPrice": mealPrice,
        "avgRating": avgRating,
        "Note": Note,
        "reporterName": reporterName
    }
    insertRestaurant(restaurant);
    console.log("Done")
    $("#frm-confirm").popup("close");
    $("#frm-create-restaurant").trigger("reset");
});
$(document).on("vclick", "#btn-edit", function () {
    $("#frm-confirm").popup("close");
});


//View Restaurant
$(document).on("pageshow", "#view_restaurant", listRestaurant);

function listRestaurant() {
    onDeviceReady()
    db.transaction(function (tx) {
        var query = "SELECT * FROM Restaurant";
        tx.executeSql(query, [], listRestaurantSuccess, errorCB);
    })
}

function listRestaurantSuccess(tx, result) {
    $("#view_restaurant #lv-restaurant-list").empty();

    var newList = "<ul data-role='listview' id='lv-restaurant-list'>";

    $.each(result.rows, function (i, item) {
        newList += "<li class='ui-content'><a href='#view_restaurant_detail' data-details='" + JSON.stringify(item) + "'>" +
            "    <h3 class='ui-li-heading'>" + item.restaurantName + "</h3>" +
            "    <p class='ui-li-desc'>Restaurant Type: " + item.restaurantType + "</p>" +
            "</a></li>";
    });

    newList += "</ul>";

    $("#view_restaurant #lv-restaurant-list").append(newList).listview("refresh").trigger("create");
}

$(document).on("vclick", "#view_restaurant #lv-restaurant-list li a", function () {
    var restaurant = $(this).data("details");
    listRestaurantDetail(restaurant);
});

function listRestaurantDetail(restaurant) {
    $("#info").empty();
    $("#info").append("<h1>" + restaurant.restaurantName + "</h1>");
    $("#info").append("<p>Restaurant Type: " + restaurant.restaurantType + "</p>");
    $("#info").append("<p>Visited Date: " + restaurant.visitDate + "</p>");
    $("#info").append("<p>Meal Price Per Person: " + restaurant.mealPrice + "</p>");
    $("#info").append("<p>Average Rating: " + restaurant.avgRating + "</p>");
    $("#info").append("<p>Note: " + restaurant.Note + "</p>");
    $("#info").append("<p>Name Of Reporter: " + restaurant.reporterName + "</p>");
    $("#info").append("<button id='edit'>Edit</button>");
    $("#info").append("<button id='delete' onclick='deleteRestaurant()'>Delete</button>");
    document.getElementById("delete").addEventListener("click", deleteRestaurant);

    function deleteRestaurant() {
        onDeviceReady();
        console.log("alo")
        db.transaction(function (tx) {
            var query = `DELETE FROM Restaurant
                WHERE restaurantId = ${restaurant.restaurantId}`;
            tx.executeSql(query, [], listRestaurantSuccess, errorCB);
        });
        alert(`Delete success ${restaurant.restaurantName}`)
        $("#info").empty();
    }
}

$("#search_restaurants").submit(function (e) {
    e.preventDefault();
    searchRestaurant($('#txt-restaurant-name-search').val());
})

function searchRestaurant(text) {
    onDeviceReady()
    db.transaction(function (tx) {
        var query = `SELECT * FROM Restaurant
                     WHERE restaurantName like '${text}%'`;
        console.log(query);
        tx.executeSql(query, [], listSearchRestaurantSuccess, errorCB);

    })
}

function listSearchRestaurantSuccess(tx, result) {
    console.log(result)
    $("#search_restaurant #lv-restaurant-list").empty();

    var newList = "<ul data-role='listview' id='lv-restaurant-list'>";

    $.each(result.rows, function (i, item) {
        newList += "<li class='ui-content'><a href='#search_restaurant_detail' data-details='" + JSON.stringify(item) + "'>" +
            "    <h3 class='ui-li-heading'>" + item.restaurantName + "</h3>" +
            "    <p class='ui-li-desc'>Restaurant Type: " + item.restaurantType + "</p>" +
            "</a></li>";
    });

    newList += "</ul>";

    $("#search_restaurant #lv-restaurant-list").append(newList).listview("refresh").trigger("create");
}

$(document).on("vclick", "#search_restaurant #lv-restaurant-list li a", function () {
    var restaurant = $(this).data("details");
    listRestaurantDetail(restaurant);
});

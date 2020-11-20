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
    alert("alo alo")
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
                                            reporterName) Value(?,?,?,?,?,?,?)`
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

    // console.log(restaurant);
    // return false;
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
    // $("#frm-confirm").popup("close");
    // $("#frm-create-restaurant").trigger("reset");
});
$(document).on("vclick", "#btn-edit", function(){
    $("#frm-confirm").popup("close");
});
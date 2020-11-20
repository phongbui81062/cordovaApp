document.addEventListener("deviceready", onDeviceReady, false);

var db = "";

function restaurantDB(tx) {
    tx.executeSql(`create table if not exists Restaurant(restaurantId integer primary key autoincrement,
        restaurantName text not null,
        restaurantType text not null,
        visitDate text not null default current_timestamp,
        mealPrice interger not null,
        avgRating interger not null,
        Note text,
        reporterName text not null)`
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
        var query = `insert into Restaurent(restaurantName,
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
        }, transError)
    })
}

$("#frm-create-restaurant").submit(function (e) {
    e.preventDefault();
    var restaurantName = $("#txt-restaurant-name").val();
    var restaurantType = $("#txt-restaurant-type").val();
    var visitDate = $("#datetime-visit-time").val();
    var mealPrice = parseInt($("#txt-meal-price").val());
    var avgRating = (parseInt($("#txt-service-rating").val()) + parseInt($("#txt-cleanliness-rating").val()) + parseInt($("#txt-food-rating").val())) / 3;
    var Note = $("#txt-Notes").val();
    var reporterName = $("txt-reporter").val();
    var restaurant = {
        "restaurantName": restaurantName,
        "restaurantType": restaurantType,
        "visitDate": visitDate,
        "mealPrice": mealPrice,
        "avgRating": avgRating,
        "Note": Note,
        "reporterName": reporterName
    }
    console.log(restaurant);
    // return false;

})


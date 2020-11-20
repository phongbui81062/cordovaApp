document.addEventListener("deviceready", onDeviceReady, false);

var db = "";

function restaurantDB(tx) {
    tx.executeSql(`create table if not exists Restaurant(restaurantId integer primary key autoincrement,
        restaurantName text not null,
        restaurantType text not null,
        visitDate DATETIME not null default current_timestamp,
        mealPrice interger not null,
        serviceRating text not null,
        cleanRating text not null,
        foodQuality text not null,
        Note text,
        reporterName text not null)`
        );

}


function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}


function successCB() {
    alert("alo alo")
}


function onDeviceReady() {
    db = window.openDatabase("Restaurant", "1.0", "Restaurant", 200000)
    db.transaction(restaurantDB, errorCB, successCB);
}

function insertRestaurant(restaurant){
    db.transaction(function (tx){
        var query = `insert into Restaurent(restaurantName,
                                            restaurantType,
                                            visitDate,
                                            mealPrice,
                                            serviceRating,
                                            cleanRating,
                                            foodQuality,
                                            Note,
                                            reporterName) Value(?,?,?,?,?,?,?,?,?)`
        tx.executeSql(query,[restaurant.restaurantName,
                            restaurant.restaurantType,
                            restaurant.visitDate,
                            restaurant.mealPrice,
                            restaurant.serviceRating,
                            restaurant.cleanRating,
                            restaurant.foodQuality,
                            restaurant.Note,
                            restaurant.reporterName],function (){
            console.log("insert done");
        },transError)
    })
}
// function updateRestaurant(restaurant){
//     db.transaction(function (tx){
//         var query = `update Restaurent Set Name=?,Location=? where id =${restaurant.id}`
//         tx.executeSql(query,[restaurant.Name,restaurant.Location],function (){
//             console.log("update done");
//         },transError)
//     })
// }

// function searchRestaurant(restaurant){
//     db.transaction(function (tx){
//         var query = `select * from Restaurent where Name like "%${restaurant.Name}%",Location=? where id =${restaurant.id}`
//         tx.executeSql(query,[restaurant.Name,restaurant.Location],function (){
//             console.log("search done");
//         },transError)
//     })
// }
// function deleteRestaurant(restaurant){
//     db.transaction(function (tx){
//         var query = `delele from Restaurent where id=${restaurant.id}",Location=? where id =${restaurant.id}`
//         tx.executeSql(query,[],function (){
//             alert("delete done");
//         },transError)
//     })
// }
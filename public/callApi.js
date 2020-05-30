module.exports = function callApi(url, callback) {
    var accessToken = getToken();

    $.ajax({
        url: url + "" + accessToken,
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        success: callback
    });
};

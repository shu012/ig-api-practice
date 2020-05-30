module.exports = function callApi(url, callback) {
    $.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        success: callback
    });
};
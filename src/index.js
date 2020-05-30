var callApi = require('./callApi');
var modal = require('./modal');

$(document).ready(function () {
    var imageURL = "https://api.instagram.com/v1/users/self/media/recent/?access_token=".concat(getToken());

    // Load images
    function loadImages(response) { 
        var images = response.data.map(function (instance, index) {
            return createObj(instance, index);
        });
        console.log(images);
        var searchQuery = window.location.search.split('=')[1];
        var filteredImages = images.filter(image => imageMatchesSearchQuery(image, searchQuery));

        if(filteredImages.length === 0) {
            $('#border').removeClass('border');
            document.getElementById('border').innerHTML = '<center><h3 id="empty">No media was found.</h3></center>';
        }

        appendImages(filteredImages.map((image, index) => Object.assign({}, image, { id: index })));
    }

    callApi(imageURL, loadImages);

    //Set user's name and user's url
    function setUser(response) {
        var user_url = "https://www.instagram.com/" + response.data.username;
        document.getElementById("user").innerHTML = response.data.username;
    }
    callApi("https://api.instagram.com/v1/users/self/?access_token=".concat(getToken()), setUser);

    // Helper Functions
    function createObj(instance, index) {
        var commonObject = {
            id: index,
            caption: instance.caption.text,
            taggedUsers: instance.users_in_photo,
            type: instance.type,
            tags: instance.tags,
            image: {
                standard: instance.images.standard_resolution.url,
            }
        };

        if (instance.type === "image") {
            return commonObject;
        }
        else if(instance.type === "video") {
            return Object.assign(commonObject, {
                video: {
                    standard: instance.videos.standard_resolution.url
                }
            });
        }
    }

    function imageMatchesSearchQuery(image, query) {
        if (!query || !query.length) return true;
        var userTag = image.taggedUsers.map(
            u => u.user.username
        )

        if(userTag.indexOf(query) !== -1) {
            return userTag;
        }

        else {
            return image.tags.indexOf(query) !== -1;
        }
    };

    function imageHTML(id, url) {
        return (
            '<div class="responsive gallery_img" data-id="' + id + '">' +
                '<div class="img">' +
                    '<img src=' + url + ' />' +
                '</div>' +
            '</div>'
        )
    };

    function appendImages(images) {
        var imageElems = images.map(function (image) { return imageHTML(image.id, image.image.standard) });
        $('#img').append(imageElems);
        modal(images);
    }

    // Parse out the access token from the URL
    function getToken() {
        var url = document.URL;
        var accessToken = url.substring(url.indexOf("access_token=") + 13, url.length);
        return accessToken;
    }

    $('#logout').on("click", function (event) {
        event.preventDefault();

        my_window = window.open("https://instagram.com/accounts/logout/", 
                                "Window-Name", 
                                "height=1, width=1");

        $(my_window).ready(function() {
            window.setTimeout(function () {
                my_window.close();
                window.location.replace("./logout.html");
            }, 1000);
        });
    });

    $('#likes').on('click', function () {
        $('#likes').addClass("active");
        $('#myPhotos').removeClass("active");
        $('.gallery_img').remove();
        callApi("https://api.instagram.com/v1/users/self/media/liked?access_token=".concat(getToken()), loadImages);
    });
});

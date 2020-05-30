# Instagram Image Gallery

## Synopsis
Utlizes an Instagram API to view an Instagram user's media and likes.  This application includes the following technologies: <br>
-HTML <br>
-Javascript <br>
-JQuery <br>
-AJAX <br>
-CSS <br>
-gulp

## Installation
Run the following commands in your terminal:

```
npm install
gulp
```

## User's Guide
Log in to Instagram to view your media or click on `My Likes` to view your liked media.

### HTML Files
-`index.html` <br>
-`login.html` <br>
-`logout.html`

<br>
### CSS Files
### stylesheet.css

##### Clear Fix
```css
html,
body,
div,
	.
	.
	.
.cf {
    *zoom: 1;
}
```
##### Headers
-`h1` <br>
-`h3`

##### Navigation Bar
-`.nav_bar` <br>
-`ul` <br>
-`li` <br>
-`li:last-child` <br>
-`li:first-child` <br>
-`li a` <br>
-`li: hover` <br>
-`li a:hover:not(.active)` <br>
-`.active` <br>
-`.nav_bar` <br>
-`.fitToBox` <br>
-`.myPhotos`

##### Headers
-`h1` <br>
-`h3`

##### Border
-`.border`

##### Search Bar
-`form` <br>
-`.search` <br>
-`.button` <br>
-`.button:hover` <br>
-`input[type=text]`

##### Responsive Images

###### The Image
-`.responsive .img` <br>
-`.responive .img:hover` <br>
-`div.img img` <br>
-`.gallery_img img` <br>
-`*`

###### Responsiveness
-`.responsive` <br>
-`.responsive:hover`

###### The Modal (Background)
-`.modal`

###### Modal Content (Image)
-`.modal-content` <br>
-`.modal-open` <br>
-`.responsive.model-content:show`

###### Caption of Modal Image
-`#caption`

###### Animation
-`.modal-content, #caption` <br>
-`@-webkit-keyframes zoom` <br>
-`@keyframes zoom`

###### Close Button
-`.close` <br>
-`.close:hover, .close:focus`

###### Next Button
-`.next` <br>
-`next:hover, next:focus`

###### Previous Button
-`prev` <br>
-`.prev:hover, .prev:focus`

###### Responsive Columns
-`@media only screen and (max-width: 700px` <br>
-`@media only screen and (max-width: 500px)`
######Clear Floats
-`clearfix:after`


### Javascript Files

### `gulp.js`
Watches, builds, and serves files.

<br>

### `index.js`
All Functions are called within `$(document).ready( function() )`. <br>
String `imageUrl` stores the full API URL to return a user's recent media.

##### `createObj(instance, index)`:

###### Parameters
Object `instance` is a data set from the API response.  Integer `index` represents the id of the image.  It is also the image's index in the array.

###### Functionality
Creates an object that contains the media's `id`, `caption`, `taggedUsers`, `type`, `tags`, and relevant URLs.

```js
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
```

##### `loadImages(response)`:

###### Parameters
Object `response` holds all the data passed back by the API.

###### Functionality
Array of objects, `images`, stores the objects created in `createObj()`.  If a search has been applied `filteredImages` stores the objects in `images` that match the search using `imageMatchesSearchQuery()` and load the images to the page via `appendImages()`.

```js
function loadImages(response) { 
    var images = response.data.map(function (instance, index) {
        return createObj(instance, index);
    });

    var searchQuery = window.location.search.split('=')[1];
    var filteredImages = images.filter(image => imageMatchesSearchQuery(image, searchQuery));

    if(filteredImages.length === 0) {
        $('#border').removeClass('border');
        document.getElementById('border').innerHTML = '<center><h3 id="empty">No media was found.</h3></center>';
    }

    appendImages(filteredImages.map((image, index) => Object.assign({}, image, { id: index })));
}
```

##### `imageMatchesSearchQuery(image, query)`:

###### Parameters
Object `image` is a single object from `images` and string `query` holds the string to be searched for.

###### Functionality
Searches a media object's `taggedUsers` and `tags`.

```js
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
```

##### `imageHTML(id, url)`:

###### Parameters
Variables `id` and `url` hold a media's id and URL, respectively.

###### Functionality
Returns the HTML code to append the image to the page.

```js
function imageHTML(id, url) {
    return (
        '<div class="responsive gallery_img" data-id="' + id + '">' +
            '<div class="img">' +
                '<img src=' + url + ' />' +
            '</div>' +
        '</div>'
    )
};
```

##### `appendImages(images)`:

###### Parameters
`images` is an array of objects containing the relevant information about the user's media.

###### Functionality
Adds the media to the page.

```js
function appendImages(images) {
    var imageElems = images.map(function (image) { return imageHTML(image.id, image.image.low) });
    $('#img').append(imageElems);
    modal(images);
}
```

##### `getToken()`:

###### Parameters:
`getToken()` passes no parameters.

###### Functionality
`getToken()` declares a variable `url` and initializes it to the `document.URL`.  `access` is set to the parsed out string containing the access token in `url`.  `accessToken` is returned.

```js
function getToken() {
    var url = document.URL;
    var accessToken = url.substring(url.indexOf("access_token=") + 13, url.length);
    return accessToken;
}
```

##### `$('#logout').on('click', function)`:

###### Functionality
The `active` class changes from `myPhotos` to `likes`.  All exisiting images are cleared and function `loadImages` is called again using the API to access a user's liked media.

```js
$('#likes').on('click', function () {
    $('#likes').addClass("active");
    $('#myPhotos').removeClass("active");
    $('.gallery_img').remove();
    callApi("https://api.instagram.com/v1/users/self/media/liked?access_token=".concat(getToken()), loadImages);
});
```

##### `setUser(response)`:

###### Parameters
Object `response` holds all the data passed back by the API.

###### Functionality
Changes the header to the user's name.

```js
function setUser(response) {
    document.getElementById("user").innerHTML = response.data.full_name;
}
```

#### `callApi.js`
##### `callApi(url, callback)`

###### Parameters
`callApi()` passes a URL string and a function, `callback`.

###### Functionality
`callApi()` utilizes an `$.ajax()` function to recieve data from a specified API.
```js
function callApi(url, callback) {
    $.ajax({
        url: url + "" + accessToken,
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        success: callback
    });
};
```

<br>

### `modal.js`
##### `modal(imagesArray)`:

###### Parameters
`imagesArray` is an array of objects containing information about a user's media.

###### Functionality
`modal(imagesArray)` handles onclick functionality in regards to the modal. <br>

**Variables** <br>
-`modal`: The modal. <br>
-`captionElem`: Caption element in the modal. <br>
-`modalImage`: Modal for media of type image. <br>
-`modalVideo`: Modal for media of type video. <br>
######onclick variables
-`close`: Closes the modal on click. <br>
-`next`: Loads the next media into the modal. <br>
-`prev`: Loads the previous media into the modal. <br>
-`$('.gallery_img')`: Loads the intial media into the modal <br> <br>

**Functions** <br>
-`loadModal(index)`
###### Parameters
Integer `index` contains the attribute `data-id` of the element, which represents the index of the media in `imagesArray`.

###### Functionality
Closes the image or video modal if there is a type change and open the current type modal using the new media's information.

```js
function loadModal(index) {
    if(imagesArray[index].type === "image") {
        modalImage.show();
        modalVideo.hide();
        modalImage.attr('src', imagesArray[index].image.standard);
    }

    else if(imagesArray[index].type === "video") {
        modalImage.hide();
        modalVideo.show();
        modalVideo.attr('src', imagesArray[index].video.standard);
    }

    modalImage.attr('alt', index);
    captionElem.text(imagesArray[index].caption);
}
```

## Known Bugs
-The border does not extend to the bottom of the window during `search` <br>
-Changes in media types in the modal creates an animation on next or previous commands

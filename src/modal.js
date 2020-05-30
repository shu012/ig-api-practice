function modal (imagesArray) {
    var modal = $('#myModal');
    var captionElem = $("#caption");
    var modalImage = $('#img01');
    var modalVideo = $('#vid01');

    var close = document.getElementsByClassName("close")[0];
    close.onclick = function() {
        modal.hide();
        $("#body").removeClass("modal-open");
    }

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

    var next = document.getElementsByClassName("next")[0];
    next.onclick = function() {
        var i = img01.alt;
        ++i;

        loadModal(i);
    }

    var prev = document.getElementsByClassName("prev")[0];
    prev.onclick = function() {
        var i = img01.alt;
        --i;

        loadModal(i);
    }

    $('.gallery_img').on('click', function () {
        $("#body").addClass("modal-open");
        var id = $(this).attr('data-id');
        modal.show();
        loadModal(id);
    });
};

module.exports = modal;
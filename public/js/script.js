$(window).on('load', function() { 
    
    // Search button
    let searchButton = $('#searchblock>input:nth-child(2)');
    // Search input
    let searchKeyword = $('#searchblock>input:nth-child(1)');

    // Method to initialize search keyword
    $( searchButton ).click(function(event) {

        event.preventDefault();

        // Input value
        let searchInputCurrentValue = searchKeyword.val();

        // Flickr api key
        let flickApiKey = 'f593323f92f1180547c85a25cad2e576';

        // Picture search method
        let url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickApiKey + '&privacy_filter=1' + '&content_type=1' + '&tags=' + searchInputCurrentValue + '&safe_search=1' + '&page=1' + '&per_page=5';

        // Get json from flickr hosting, via input value
        $.getJSON(url + '&format=json&jsoncallback=?' , function( data ) {

            // Get img element
            let previousAddedImgTags = $('#pictureblock').find('img');

            // Condition to check if there are still element from previous search and remove
            if (previousAddedImgTags !== 0) {
                previousAddedImgTags.remove();
            }

            // Loop through array , if data will be equal to 5 , otherwise if condition is false then remove it
            if(data.photos.photo.length === 5) {

                $.each(data.photos.photo, function( index, value ) {

                    // assign data iteration to flickr rest rest api request
                    let resultUrl = 'https://farm' + value.farm + '.staticflickr.com/' + value.server + '/' + value.id + '_' + value.secret + '.jpg';
                    // new image appent to predefined element and add src to already created img from previous variable 
                    $('<img>').attr("src", resultUrl).appendTo("#pictureblock");

                  }).fail(function(jqxhr, textStatus, error) {

                    let err = textStatus + ', ' + error;
                    alert( 'Request Failed: ' + ' ' + err );
                    
                });

            } else {

                alert('We can not show your result, because current result is' + ' ' + data.photos.photo.length + ' ' + 'and its need to be equal to 5 ))');

            }
        })
    });
});

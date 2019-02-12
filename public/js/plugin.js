(function ( $ ) {
 
    $.fn.dragMod = function( options ) {
 
        // Default options
        let dragWrapperSettings = $.extend({
            flickerKey: 'f593323f92f1180547c85a25cad2e576'
        }, options );


        // Find wrapper
        let mainWrapper = $(this);
        mainWrapper.addClass('mainwrapper');
        mainWrapper.css('margin', '3em');


        // Craete search block parent
        let searchBlockParent = $('<section>', {
            class: 'searchblock'
        });
        // Craete searchblock input field
        let searchBlockInput = $('<input>', {
            type: 'text'
        });
        // Create searchblock input button
        let searchBlockButton = $('<input>', {
            class: 'search',
            type: 'submit',
            value: 'Search'
        });
        // Append searchbloxk element to parent
        $(searchBlockParent).append(searchBlockInput, searchBlockButton);


        // Create images block section
        let imagesBlockParent = $('<section>', {
            class: 'dragdropsection'
        });
        // Create image block section child picture block
        let imagesBlockChild = $('<div>', {
            class: 'pictureblock'
        });
        // Append picture block child to picture block parent
        $(imagesBlockParent).append(imagesBlockChild);
        imagesBlockParent.hide();


        // Create basket section
        let basketBlockParent = $('<section>', {
            class: 'basketsection'
        });
        // Create basket block child
        let basketBlockChild = $('<div>', {
            class: 'inputsanswerparent'
        });
        // Append basket block child to its parent
        $(basketBlockParent).append(basketBlockChild);
        basketBlockParent.hide();



        // Create saved group parent
        let savedImageGroup = $('<section>', {
            class: 'savedgroup'
        });
        savedImageGroup.css('margin', '1em');
        savedImageGroup.hide();



        $(mainWrapper).append(searchBlockParent, imagesBlockParent, basketBlockParent, savedImageGroup);

        


        // Call event when click on button
        mainWrapper.find('.search').off().on('click', function(event){

            event.preventDefault();

            // Remove previous finded images
            imagesBlockParent.find('img').remove();
            // Remove previous added inputs with answer
            basketBlockChild.find( 'input' ).remove();
            savedImageGroup.find( 'img' ).remove();
            savedImageGroup.hide();

            // Flicker key
            let flickApiKey = dragWrapperSettings.flickerKey;

            // Get element input value and split into array
            let searchedValue = $(searchBlockInput).val().split( ' ' );
            // Assign variable to empty array
            let arrayWithoutWhitespaces = [];
            // Iterate over value array and delete white spaces
            $.each(searchedValue,function(index, value) {
                
                // Check if current cycle element is empty string
                if(value !== '') {

                    // Add non empty value to array
                    arrayWithoutWhitespaces.push(value);

                }

            });
            // Iterate over filter(without whitespace) array and call endpoint
            $.each(arrayWithoutWhitespaces, function(index, value) {

                // Current keyword variable
                let currentKeyword = value;
                // Every time create input for attaching to answer input parent block
                let initialInput = $('<input>', {
                    'value': currentKeyword,
                    'type': 'submit'
                });
                initialInput.css('margin', '4em');
                // Ready endpoint for url
                let url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickApiKey + '&privacy_filter=1' + '&content_type=1' + '&tags=' + value + '&safe_search=1' + '&page=1' + '&per_page=5';
                // Request to flicker endpoint
                $.getJSON(url + '&format=json&jsoncallback=?' , function( data ) {

                   
                    // If data will be 5 then invoke
                    if(data.photos.photo.length === 5) {

                        // Attach 
                        basketBlockChild.append(initialInput);
                        

                        // Iterate over photos and attach it to predefined block && attach keyword to each image
                        $.each(data.photos.photo, function( index, value ) {

                            // assign data iteration to flickr rest rest api request
                            let resultUrl = 'https://farm' + value.farm + '.staticflickr.com/' + value.server + '/' + value.id + '_' + value.secret + '.jpg';
                            // new image appent to predefined element and add src to already created img from previous variable 
                            let images = $('<img>').attr({'src':resultUrl, 'data-name': currentKeyword}).appendTo(imagesBlockChild);
                            images.css({
                                'padding-top': '2px',
                                'padding-bottom': '2px',
                                'padding-let': '2px',
                                'padding-right': '2px'
                            });
                            imagesBlockParent.show();
                            basketBlockParent.show();
                        
                        });

                        
                        // Dragable funtion
                        mainWrapper.find('img').draggable({
                            containment: mainWrapper,
                            revert: function(){
                                if($(this).hasClass('incorrect')) {
                                    return true
                                } else{
                                    return false
                                }
                            }
                        });

                        // Get loaded iamges length
                        let loadedImagesLength = mainWrapper.find('img').length
                        // Dropable function
                        mainWrapper.find(initialInput).droppable({
                            tolerance: 'pointer',
                            accept: 'img',
                            over: function(event,ui){
                                
                                // Get dragable object data name
                                let uiDragableCheck = ui.draggable.data().name;
                                // Get dropable object value
                                let uiDropableCheck = $(this).val();
                                // Check if dragable and dropable values are equal
                                if(uiDragableCheck == uiDropableCheck){
                                    $(this).addClass('correctchoosestyle');
                                    if(ui.draggable.hasClass('incorrect')){
                                        ui.draggable.removeClass('incorrect')
                                    }
                                } else{
                                    ui.draggable.addClass('incorrect')
                                    $(this).addClass('wrongchoosestyle')
                                    if(ui.draggable.hasClass('correctchoosestyle')) {
                                        ui.draggable.removeClass('correctchoosestyle')
                                    }
                                }

                            },
                            drop: function(event, ui) {
                                // Get ui dragable data name
                                let uiDragable = ui.draggable.data().name;
                                // Get ui dropable data name
                                let uiDropable = $(this).val();
                                // Check if valeus are equal
                                if(uiDragable == uiDropable) {
                                    // Remove current image
                                    ui.draggable.remove();
                                    // Assign previous stored data about images length and after each cycle reduce 1

                                    let newData = --loadedImagesLength;
                                    // Check if array
                                    if(newData === 0){
                                        
                                        imagesBlockParent.hide();
                                        basketBlockParent.hide();
                                        alert('Your cickle was ended');

                                    } else {
                                        
                                        // Get current image src
                                        let currentUrl = ui.draggable.context.currentSrc;
                                        savedImageGroup.show();
                                        let groupImageParentURL = $('<a></a>').attr('href', currentUrl).appendTo(savedImageGroup);
                                        $('<img>').attr("src", currentUrl).css('padding', '1em').appendTo(groupImageParentURL);
                                        let lastChild = $(savedImageGroup).children().last();
                                        $( lastChild[0] ).click( function(event) {

                                            event.preventDefault();
                                            // Get current image URL
                                            let currentImg = $(this).context.href;
                                            // Add current image url to newest created image
                                            let imgTag = $('<img>').attr('src', currentImg);
                                            // Create new wrapper
                                            let modalStructure = $('<section></section>');
                                            // Add already created image to previous div
                                            imgTag.appendTo(modalStructure);
                                            // Group div image variabler
                                            let retrieveSelectedImage = modalStructure.children();
                                            $( modalStructure ).dialog({
                                                modal: true,
                                                maxHeight: document.innerHeight,
                                                maxWidth: document.innerWidth, 
                                                minHeight: retrieveSelectedImage[0].naturalHeight,
                                                minWidth: retrieveSelectedImage[0].naturalWidth,
                                                draggable: false
                                            });
                                            // Set modal padding
                                            modalStructure.css('padding', 0);
                                            // Set modal image width
                                            imgTag.css('width', 100 + '%')
                                        })

                                    }
                                };
                            },
                            deactivate: function() {
                                $(this).removeClass('correctchoosestyle wrongchoosestyle')
                            }
                        })
                       

                    } else {

                        alert('We can not show your result, because current result is' + ' ' + data.photos.photo.length + ' ' + 'and its need to be equal to 5 ))');    

                    }

                });

            });

        });


    };
 
}( jQuery ));

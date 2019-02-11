(function ( $ ) {
 
    $.fn.dragMod = function( options ) {
 
        // This is the easiest way to have default options.
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



        $(mainWrapper).append(searchBlockParent, imagesBlockParent, basketBlockParent, savedImageGroup)
        


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
                            let images = $('<img>').attr({'src':resultUrl, 'data-name': currentKeyword}).appendTo(imagesBlockParent);
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

                        // Dropable function
                        mainWrapper.find(initialInput).droppable({
                            tolerance: 'touch',
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
                                    // Check if array
                                    if(mainWrapper.find('img').length === 0){

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
//  // Search button
//  let searchButton = $('#searchblock>input:nth-child(2)');
//  // Search input
//  let searchKeyword = $('#searchblock>input:nth-child(1)');

//  // Search input answer parent
//  let inputParent = $('#inputsanswerparent');
//  // Remove parent input
//  inputParent.remove();

//  // Find basketsection
//  let basketSection = $('#basketsection');
//  // Hide basketstation
//  basketSection.hide();

//  // Find saved group
//  let imgGroup = $('#savedgroup');
//  // Hide saved group
//  imgGroup.hide();
  
//  // Predefined keyword array
//  let predefinedArrayKeyword = ['dog', 'lorem', 'OATH', '2FA'];

//  // Predefind wrong keywords for situation , when searched value and new added values are same
//  let predefinedFakeWords = ['Anon', 'CVE', 'Expect', 'Onion'];


//  // Method to initialize search keyword
//  $( searchButton ).click(function(event) {

//      event.preventDefault();

//      // Basket section show
//      basketSection.show();
//      // Image group show
//      imgGroup.show();
//      // Append to basketsection previously stored search input parent
//      inputParent.appendTo(basketSection);

//      // Input value
//      let searchInputCurrentValue = searchKeyword.val();

//      // Push new value or keyword into predefined words
//      predefinedArrayKeyword.push(searchInputCurrentValue);

//      // Flickr api key
//      let flickApiKey = 'f593323f92f1180547c85a25cad2e576';

//      // Picture search method
//      let url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickApiKey + '&privacy_filter=1' + '&content_type=1' + '&tags=' + searchInputCurrentValue + '&safe_search=1' + '&page=1' + '&per_page=5';

//      // Get json from flickr hosting, via input value
//      $.getJSON(url + '&format=json&jsoncallback=?' , function( data ) {


//          // Get img element
//          let previousAddedImgTags = $('#pictureblock').find('img');

//          // Get group img element
//          let groupImages = imgGroup.find('img');
         
//          if(groupImages !== 0) {
//              groupImages.remove();
//          };

//          // Get json length to calculate if images over
//          let dataLength = data.photos.photo.length + 1

//          // Condition to check if there are still element from previous search and remove
//          if (previousAddedImgTags !== 0) {
//              previousAddedImgTags.remove();
//          };
         
//          // Loop through array , if data will be equal to 5 , otherwise if condition is false then remove it
//          if(data.photos.photo.length === 5) {
             
//              // Enable input parent
//              inputParent.show();

//              $.each(data.photos.photo, function( index, value ) {

//                  // assign data iteration to flickr rest rest api request
//                  let resultUrl = 'https://farm' + value.farm + '.staticflickr.com/' + value.server + '/' + value.id + '_' + value.secret + '.jpg';
//                  // new image appent to predefined element and add src to already created img from previous variable 
//                  $('<img>').attr("src", resultUrl).appendTo("#pictureblock");

//              })

//              // Allow drag from parent element
//              $( 'img' ).draggable({ 
//                   scroll: false,
//                   // Revert function
//                   revert: function (){

//                       // Check condition if dragable has noted class name
//                       if($(this).hasClass( 'correct' )) {

//                          // Return false during disable revert
//                          return false

//                       } else if($(this).hasClass( 'wrong' )) {

//                          // Remove previously add class and return to its initial place
//                          $(this).removeClass( 'correct' );
//                          $(this).removeClass( 'wrong' );
//                          return true

//                       }
//                   }
//              });
             

//              // Dropable element
//              $( '#basketsection > div > input' ).droppable({
//                  tolerance : 'pointer',
//                  // Option to invoke dropable function , when exact element is over 
//                  accept: 'img',
//                  // Call function when exact element over it
//                  over: function( event, ui ) {

//                      let inputValue = $(this).val();
//                      if(searchInputCurrentValue === inputValue) {

//                          // Remove class correct
//                          $(ui.draggable).removeClass('wrong');
//                          // Add class to correct
//                          $(ui.draggable).addClass('correct');
//                          // Add style when correct choose
//                          $(this).addClass( 'correctchoosestyle' );
//                          // Reduce array length after each true answer
//                          let newData = --dataLength;
//                          console.log(newData)
//                          // Remove dragable element
//                          ui.draggable.remove();
//                          if(newData <= 1 ) {

//                              alert('Your cycle over')

//                          } else {

//                              // Get dragable element current src
//                              let currentUrl = ui.draggable.context.currentSrc;
//                              // Find group image element
//                              let groupImageParent = $('#savedgroup');
//                              // Create image tag with dragable image src and append to previous searched group div
//                              let groupImageParentURL = $('<a></a>').attr('href', currentUrl).appendTo(groupImageParent);
//                              // Add image url to div
//                              $('<img>').attr("src", currentUrl).appendTo(groupImageParentURL);
//                              // Find last child of group image
//                              let lastChild = $(groupImageParent).children().last();
//                              // Call event when click in current image
//                              $( lastChild[0] ).click( function(event) {

//                                  event.preventDefault();
//                                  // Get current image URL
//                                  let currentImg = $(this).context.href;
//                                  // Add current image url to newest created image
//                                  let imgTag = $('<img>').attr('src', currentImg);
//                                  // Create new wrapper
//                                  let modalStructure = $('<section></section>');
//                                  // Add already created image to previous div
//                                  imgTag.appendTo(modalStructure);
//                                  // Group div image variabler
//                                  let retrieveSelectedImage = modalStructure.children();
//                                  $( modalStructure ).dialog({
//                                      modal: true,
//                                      maxHeight: document.innerHeight,
//                                      maxWidth: document.innerWidth, 
//                                      minHeight: retrieveSelectedImage[0].naturalHeight,
//                                      minWidth: retrieveSelectedImage[0].naturalWidth,
//                                      draggable: false
//                                  });
//                                  // Set modal padding
//                                  modalStructure.css('padding', 0);
//                                  // Set modal image width
//                                  imgTag.css('width', 100 + '%');

//                              })
                           
//                          }

//                      } else {

//                          // Remove class correct
//                          $(ui.draggable).removeClass('correct');
//                          // Add class correct
//                          $(ui.draggable).addClass('wrong');
//                          // Add style wehn wrong choose
//                          $(this).addClass( 'wrongchoosestyle' );

//                      }

//                  },
//                  // Call function when element out from dropable zone border
//                  deactivate: function( event, ui ) {

//                      $( this ).removeClass( 'wrongchoosestyle correctchoosestyle' )

//                  }
//              });


//              // Itertate over buttons value
//              $( '#basketsection > div' ).children('input').each(function (index, elem) {

//                  let self = $(this);

//                  // Condition to check if selected element is fist index
//                  if(index === 0) {

//                     // Set first button correct value
//                     self.val(searchInputCurrentValue)

//                  };
//                  // Condition to check if selected element is second index
//                  if(index === 1) {

//                      let secondButtonValueElement = self;
//                      // Get random word from predefined and just added new keywords
//                      let randomPreviousSearchedWords = predefinedArrayKeyword[Math.floor(predefinedArrayKeyword.length * Math.random())];
//                      // Get random word from fake Array
//                      let randomFakeWords = predefinedFakeWords[Math.floor(predefinedFakeWords.length * Math.random())]
                     
//                      // Check if predefined array word is not equal to search word
//                      if(randomPreviousSearchedWords !==  searchInputCurrentValue) {
                         
//                          // Set second input value with wrong data
//                          self.val(randomPreviousSearchedWords)

//                      } else {

//                          // Set second input value with data , which wasn't previous added into predefinedworld list
//                          self.val(randomFakeWords)

//                      }

//                  }
//              });

//          } else {

//              alert('We can not show your result, because current result is' + ' ' + data.photos.photo.length + ' ' + 'and its need to be equal to 5 ))');

//          }
//      }).fail(function(jqxhr, textStatus, error) {

//          let err = textStatus + ', ' + error;
//          alert( 'Request Failed: ' + ' ' + err );

//      });
//  });
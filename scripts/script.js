'use strict';
// prepare the document
$(document).ready(function() {

  // add an event listener to the form, so that when the form
  // is submitted, the callback function runs
  $('#find-meetup').submit(function(e) {
    e.preventDefault();
    // $('.next-button').style.display = 'block';

    // get the values from the form input
    var query,
        zip,
        formInput = $('#text'),
        formZip = $('#zip'),
        $searchResults = $('#results'),
        $resultsInfo = $('#showing');


    // check if the input is in the right format
    if(formInput.val() !== "") {
      query = formInput.val();
    } else {
      return;
    }

    // check if the user has entered a value for the postal code
    // and set the value to null if they haven't
    if(formZip.val() !== "") {
      zip = formZip.val();
    } else {
      zip = 'null';
    }

    // build the different parts of the url query, these will be passed into the ajax call
    var partUrl = 'https://api.meetup.com/find/groups?';
    var key = 'key=432538256a6914151e2652604b43655a';
    var meetups = '&allMeetups=false';
    var only = '&only=name,city,country,link,members,who,group_photo,next_event,description&page=20&text=';
    var addZip = '&zip='
    var addOffset = '&offset='
    var callback = '&callback=?';
    var offset = 0;

    // build the full url made up of the different parts
    var fullUrl = partUrl+key+meetups+only+query+addZip+zip+addOffset+offset+callback;
    console.log(fullUrl);


    // make an ajax object that uses the .ajax jQuery method to make a call to the meetup API
    var ajaxObject = $.ajax({
      type: 'GET',
      url: fullUrl,
      dataType: 'jsonp',
      data: {}
    });

    // use a callback function to process the results from the search
    ajaxObject.done(function(results) {
      var results_count = results.meta.total_count;
      var results_pages = Math.ceil(results_count/20);

      console.log(results);

      //clear the old results before loading in the new results
      $searchResults.html("");
      $resultsInfo.html("");

      // scroll to the results section of the page
      $("html, body").animate({
        scrollTop: $('#results').offset().top
      }, "slow");

      // information about the search results
      $('#showing').append('<div id="results-showing"><p>Showing results for <span>"'+query+'"</span></p></div>');

      //check if there is a resulting array, and if there is, check if it has any object inside it
      if(results.data && results.data.length > 0) {

        // loop through each of the objects in the resulting array
        // and do something with the results using an anonymous function
        $.each(results.data, function() {

          // check if the group has a group_photo property, if it does, use the photo_link
          // if not, use the meetup no-image link
          if(this.group_photo === undefined) {
            var photo = '<div class="image no-image"><img src="https://a248.e.akamai.net/secure.meetupstatic.com/img/1/journey/simple/no_photo2.png"></div>';
          } else {
            var photo = '<div class="image present-image"><img src="'+this.group_photo.photo_link+'"></div>';
          }


          // check if there is a next_event scheduled, if there is, use it
          // if not set the property to "No upcoming event!"
          if(this.next_event === undefined) {
            var event = 'No upcoming events!';
          } else {
            var event = this.next_event.name;
          }

          // append the results from the search query to the page
          $('#results').append('<div class="card">'+photo+'<a class="page-link" href="'+this.link+'" target="_blank">'+
                              '<p class="groupname">'
                              +this.name+'</p></a>'+
                              '<p class="location">'+this.city+", "+this.country+'</p>'+
                              '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+
                              '<p class="who">'+this.members + " " +this.who+'</p>'+
                              '<p class="next-event"><span class="bold">Next Event: </span><br>'+event+'</p><br>'+
                              '<p class="descript-text"><span class="bold">Description: </span><br></p>'+
                              '<div class="description">'+this.description+'</div>'+
                              '<div class="view-group"><a class="group-link" href="'+this.link+'" target="_blank">'+
                              'Go to Group</a></div></div>');
        });

      } else {
        // if there were no results matching the query, tell the user that
        // the group they were searching wasn't found.
        $searchResults.html('<p>No results for the search '+query+' were found</p>');
      }

      //make a new ajax object for the pagination
      $('#more-results').click(function(e){
        e.preventDefault();
        if(offset < results_pages) {
          offset++;
        }
        console.log(offset);
        fullUrl = partUrl+key+meetups+only+query+addZip+zip+addOffset+offset+callback;
        var secondAjaxObject = $.ajax({
          type: 'GET',
          url: fullUrl,
          dataType: 'jsonp',
          data: {}
        });


        secondAjaxObject.done(function(results) {
          // var results_count = results.meta.total_count;
          // var results_pages = Math.ceil(results_count/20);

          //clear the old results before loading in the new results
          $searchResults.html("");
          $resultsInfo.html("");

          // scroll to the results section of the page
          $("html, body").animate({
            scrollTop: $('#results').offset().top
          }, "slow");

          // information about the search results
          $('#showing').append('<div id="results-showing"><p>Showing results for <span>"'+query+'"</span></p></div>');

          //check if there is a resulting array, and if there is, check if it has any object inside it
          if(results.data && results.data.length > 0) {

            // loop through each of the objects in the resulting array
            // and do something with the results using an anonymous function
            $.each(results.data, function() {

              // check if the group has a group_photo property, if it does, use the photo_link
              // if not, use the meetup no-image link
              if(this.group_photo === undefined) {
                var photo = '<div class="image no-image"><img src="https://a248.e.akamai.net/secure.meetupstatic.com/img/1/journey/simple/no_photo2.png"></div>';
              } else {
                var photo = '<div class="image present-image"><img src="'+this.group_photo.photo_link+'"></div>';
              }


              // check if there is a next_event scheduled, if there is, use it
              // if not set the property to "No upcoming event!"
              if(this.next_event === undefined) {
                var event = 'No upcoming events!';
              } else {
                var event = this.next_event.name;
              }

              // append the results from the search query to the page
              $('#results').append('<div class="card">'+photo+'<a class="page-link" href="'+this.link+'" target="_blank">'+
                                  '<p class="groupname">'
                                  +this.name+'</p></a>'+
                                  '<p class="location">'+this.city+", "+this.country+'</p>'+
                                  '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+
                                  '<p class="who">'+this.members + " " +this.who+'</p>'+
                                  '<p class="next-event"><span class="bold">Next Event: </span><br>'+event+'</p><br>'+
                                  '<p class="descript-text"><span class="bold">Description: </span><br></p>'+
                                  '<div class="description">'+this.description+'</div>'+
                                  '<div class="view-group"><a class="group-link" href="'+this.link+'" target="_blank">'+
                                  'Go to Group</a></div></div>');
            });

          } else {
            // if there were no results matching the query, tell the user that
            // the group they were searching wasn't found.
            $searchResults.html('<p>No more results for the search '+query+' were found</p>');
          }

        });

      });


    });
  });

  // once the window is scrolled to a certain height, display
  // a scroll to top button
  $(window).scroll(function() {
      if ($(this).scrollTop() >= 50) {
          $('#scroll-to-top').fadeIn(200);
      } else {
          $('#scroll-to-top').fadeOut(200);
      }
  });


  // add a click event listener to the scroll to top button so that when
  // it is clicked, the page scrolls back to the search form.
  $('#scroll-to-top').click(function(e) {
      e.preventDefault();
      $('body,html').animate({
          scrollTop : 0
      }, 500);
  });
});

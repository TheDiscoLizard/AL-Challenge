// From https://www.w3schools.com/howto/howto_js_scroll_to_top.asp

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("gototopbtn").style.display = "block";
  } else {
    document.getElementById("gototopbtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function getDetail(category, title_id){
    // This function is repsonsible for interacting with the /api/detail interface to pull information about a given title
    // It then writes the information to the page's modal component, before making the modal visible.
    $.get( "/api/detail",{"category":category, "id": title_id}).done(function(data) {
        title_data = JSON.parse(data);
        if (category == "movie"){ // Add the title of the movie
            $('#detail-title')[0].innerText = title_data.title;
        } else { // If no title, then the name of the show
            $('#detail-title')[0].innerText = title_data.name;
        }

        if (title_data.tagline != null){ // Add a tagline, if present
            $('#detail-tagline')[0].innerHTML = '<h6 class="card-subtitle mb-2 text-muted text-center"><i>'+title_data.tagline+'</i></h6>';
            $($('#detail-tagline')[0]).show();
        } else {
            $($('#detail-tagline')[0]).hide();
        }
        if (title_data.backdrop_path != null){ // Retrieve the appropriate backdrop image
            $('#detail-backdrop').attr("src","https://image.tmdb.org/t/p/w500/" + title_data.backdrop_path);
            $('#detail-backdrop').attr("style","width:40%;");
            $('#detail-backdrop').attr("style","height:40%;");
        } else if (title_data.poster_path != null){
            $('#detail-backdrop').attr("src","https://image.tmdb.org/t/p/w500/" + title_data.poster_path);
            $('#detail-backdrop').attr("style","width:40%;");
            $('#detail-backdrop').attr("style","height:40%;");
        } else {
            $('#detail-backdrop').attr("src","https://img.icons8.com/ios/100/000000/question-mark-filled.png");
            $('#detail-backdrop').attr("style","width:40%;");
            $('#detail-backdrop').attr("style","height:40%;");
        }
        if (category == "movie"){
            // First set of detail will be the original release date and runtime
            $('#detail-1')[0].innerHTML = '<p><span class="float-left">First Released: ' + title_data.release_date + '</span><span class="float-right">Runtime: '  + title_data.runtime + ' mins.</span></p>';
            // Second set of detail will be the genres
            $('#detail-2')[0].innerHTML = '<div>Genres: ';
            $(title_data.genres).each(function(){$('#detail-2')[0].innerHTML += '<span class="badge badge-secondary"> ' + this.name + ' </span>'});
            $('#detail-2')[0].innerHTML += '</div>';
            // Third set of detail will be various stats;
            $('#detail-3')[0].innerHTML = '<div>';
            $('#detail-3')[0].innerHTML += '<p>Status: ' + title_data.status + '</p>';
            $('#detail-3')[0].innerHTML += '<p>Budget: $' + title_data.budget.toLocaleString() + '</p>';
            $('#detail-3')[0].innerHTML += '<p>Revenue: $' + title_data.revenue.toLocaleString() + '</p>';
            $('#detail-3')[0].innerHTML += '<p>Production Studios:</p><ul class="list-group">';
            $(title_data.production_companies).each(function(){$('#detail-3')[0].innerHTML += '<li class="list-group-item">' +this.name + '</li>'});
            $('#detail-3')[0].innerHTML += '</ul>';
            $('#detail-3')[0].innerHTML += '</div>';
            // Finally, link to IMDB
            $('#detail-4')[0].innerHTML = '<div class="text-center"><a class="btn btn-info" href="https://www.imdb.com/title/' + title_data.imdb_id + '" role="button">View on IMDB</a></div>';
        } else if (category == "tv"){
            // First set of detail will be the dates the show aired
            $('#detail-1')[0].innerHTML = '<p><span class="float-left">First Aired: ' + title_data.first_air_date + '</span><span class="float-right">Last Aired: '  + title_data.last_air_date + '</span></p>';
            // Second set of detail will be the genres
            $('#detail-2')[0].innerHTML = '<div>Genres: ';
            $(title_data.genres).each(function(){$('#detail-2')[0].innerHTML += '<span class="badge badge-secondary"> ' + this.name + ' </span>'});
            $('#detail-2')[0].innerHTML += '</div>';
            // Third set of detail will show the status of the show
            $('#detail-3')[0].innerHTML = '<p>Show Status: ' + title_data.status + '</p>';
            // Finally, show table of seasons
            html_table = '<table class="table table-condensed"><thead><tr><th>Name</th><th>Air Date</th><th>Total Episodes</th></tr></thead><tbody>';
            $(title_data.seasons).each(function(){
                html_table += '<tr><td>' + this.name + '</td><td>' + this.air_date + '</td><td>' + this.episode_count + '</td></tr>';
            });
            html_table += '</tbody></table>';
            $('#detail-4')[0].innerHTML = html_table; // Write the table
        }
        $('#detail-modal').modal('toggle'); // Show the modal and its detail
    })

}
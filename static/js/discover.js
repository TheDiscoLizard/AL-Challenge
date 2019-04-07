// This is used to get top rated and top trending movies
// The results inlcude buttons that call the getDetails button from tmdb.js
$.get("/api/discover/top-rated").done(function (response) {
    results = JSON.parse(response)
    if (results.status_code){ // There's been an error, so tell the user
        $("#highestrated")[0].innerHTML = '<div class="alert alert-danger text-center">Could not load Top Rated (' + results.status_code + ') ' + results.status_message + ' </div>'
    }else{ // Otherwise, build the results table
        category = "movie";
        html = '<table class="table table-striped"><thead><tr><th>Rank</th><th>Title</th><th>Rating</th><th>Votes</th><th></th></tr></thead><tbody>';
        $(results.results).each(function(index){ // Add rows to the table for each result
            title = this.title
            html += '<tr><td>' + (index+1) + '</td><td>' + this.title + '</td><td>' + this.vote_average + '</td><td>' + this.vote_count.toLocaleString() + '</td><td><button href="#" style="cursor: pointer;" type="button" class="btn btn-info btn-block" onclick="getDetail(\'movie\',' + this.id + ');">Get details</button></td>';
        });
        html += '</tbody></table>'
        $("#highestrated")[0].innerHTML = html; // Write out the HTML
    }
});

$.get("/api/discover/top-trending").done(function (response) {
    results = JSON.parse(response);
    if (results.status_code){ // There's been an error, so tell the user
        $("#trending")[0].innerHTML = '<div class="alert alert-danger text-center">Could not load Trending (' + results.status_code + ') ' + results.status_message + ' </div>'
    }else{ // Otherwise, build the results table
        html = '<table class="table table-striped"><thead><tr><th>Rank</th><th>Title</th><th>Rating</th><th>Votes</th><th></th></tr></thead><tbody>';
        $(results.results).each(function(index){ // Add rows to the table for each result
            html += '<tr><td>' + (index+1) + '</td><td>' + this.title + '</td><td>' + this.vote_average + '</td><td>' + this.vote_count.toLocaleString() + '</td><td><button href="#" style="cursor: pointer;" type="button" class="btn btn-info btn-block" onclick="getDetail(\'movie\',' + this.id + ');">Get details</button></td>';
        });
        html += '</tbody></table>'
        $("#trending")[0].innerHTML = html; // Write out the HTML
    }
});
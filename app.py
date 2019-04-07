from flask import *
import tmdbAPI

tmdb_app = Flask(__name__)


# === Start of Main Routes ===


@tmdb_app.route("/")
def index():
    return render_template("index.html")


@tmdb_app.route("/search")
def search():
    # valid_cats and params will be used to ensure user input is valid.
    # These are defaults that will only be modified if user input is valid.
    valid_cats = ["movie", "tv", "person"]
    params = {
        "category": "movie",
        "page": 1,
        "q": ""
    }
    if request.args.get("category"):
        # A category has been supplied
        if request.args.get("category") in valid_cats:
            # And it is a valid category, so set the category
            params["category"] = request.args.get("category")
    if request.args.get("page"):
        # A page has been supplied
        if request.args.get("page").isdigit():
            # It is a valid digit, so set the page
            params["page"] = int(request.args.get("page"))
    if request.args.get("q"):
        # A query has been supplied
        params["q"] = request.args.get("q")
    if request.args.get("q"):
        # A query is present, so try a search
        response_data = tmdbAPI.search(params)
        genres = ""
        if params["category"] == "movie":
            genres = tmdbAPI.get_movie_genres()
        if params["category"] == "tv":
            genres = tmdbAPI.get_tv_genres()
        # Everything is set up, so render search.html with the params, genre list, and response data.
        return render_template("search.html", params=params, response=response_data, genres=genres)
    else:
        # Send 0 as the response. This indicates that no response is present, and that the search.html page should not
        # build any results HTML
        return render_template("search.html", params=params, response=0)


@tmdb_app.route("/discover")
def discover():
    return render_template("discover.html")


# === End of Main Routes ===

# === Start of API Abstraction Routes ===
# These are accessed by AJAX requests initiated under tmdb.js and discover.js
@tmdb_app.route("/api/discover/top-rated")
def rated():
    # call the finder function, which returns the JSON object from The Movie DB API
    return tmdbAPI.find_rated()


@tmdb_app.route("/api/discover/top-trending")
def trending():
    # call the finder function, which returns the JSON object from The Movie DB API
    return tmdbAPI.find_trending()


@tmdb_app.route("/api/detail")
def detail():
    category = ""
    title_id = ""
    if request.args["category"] == "movie":
        category = "movie"
    if request.args["category"] == "tv":
        category = "tv"
    if request.args["id"]:
        title_id = request.args["id"]
    # call the finder function, which returns the JSON object from The Movie DB API
    return tmdbAPI.get_detail(category, title_id)


# === End of API Abstraction Routes ===


if __name__ == "__main__":
    tmdb_app.run(host='0.0.0.0')

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
        "category": request.args.get("category", default="movie", type=str),
        "page": request.args.get("page", default=1, type=int),
        "q": request.args.get("q", default="", type=str)
    }
    # Check if the supplied category is valid
    if params["category"] not in valid_cats:
        # If it isn't, reset it to default
        params["category"] = "movie"
    if params["q"] != "":
        # A non-empty query has been supplied, so try a search
        response_data = tmdbAPI.search(params)
        genres = tmdbAPI.get_genres(params["category"])
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
    valid_cats = ["movie", "tv"]
    category = request.args.get("category", default="movie", type=str)
    title_id = request.args.get("id", default=0, type=int)
    if category not in valid_cats:
        category = "movie"
    # call the finder function, which returns the JSON object from The Movie DB API
    return tmdbAPI.get_detail(category, title_id)


# === End of API Abstraction Routes ===


if __name__ == "__main__":
    tmdb_app.run(host='0.0.0.0')

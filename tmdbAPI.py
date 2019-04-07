import json
import requests
import datetime

base_url = "https://api.themoviedb.org/3"
api_key = ""  # Enter your API key here


def search(params):
    # Search function that returns JSON from the Movie Database API, takes a category arg to direct the query properly.
    endpoint = "/search/" + params["category"]
    payload = {
        "api_key": api_key,
        "query": params["q"],
        "page": params["page"]
    }
    url = base_url + endpoint
    response = requests.get(url, payload)
    return response.json()


def get_movie_genres():
    # Gets the list of movie genres from the Movie Database API, which can be used to translate Genre IDs to Names.
    payload = {
        "api_key": api_key
    }
    endpoint = "/genre/movie/list"
    url = base_url + endpoint
    movie_genres = requests.get(url, payload)
    return movie_genres.json()


def get_tv_genres():
    # Gets the list of TV genres from the Movie Database API, which can be used to translate Genre IDs to Names.
    payload = {
        "api_key": api_key
    }
    endpoint = "/genre/tv/list"
    url = base_url + endpoint
    tv_genres = requests.get(url, payload)
    return tv_genres.json()


def find_rated():
    # Simple query against the MD API to pull first page of highest rated movies, that have at least 500 votes
    endpoint = "/discover/movie"
    now = datetime.datetime.now()
    payload = {
        "api_key": api_key,
        "page": 1,
        "sort_by": "vote_average.desc",
        "vote_count.gte": 500,
        "primary_release_year": now.year
    }
    url = base_url + endpoint
    response = requests.get(url, payload)
    return json.dumps(response.json())


def find_trending():
    # Simple query against the MD API to pull trending movies of the week
    endpoint = "/trending/movie/week"
    payload = {
        "api_key": api_key
    }
    url = base_url + endpoint
    response = requests.get(url, payload)
    return json.dumps(response.json())


def get_detail(category, title_id):
    # Simple query against the MD API to detail for a given movie or tv show
    endpoint = "/" + category + "/" + title_id
    payload = {
        "api_key": api_key
    }
    url = base_url + endpoint
    response = requests.get(url, payload)
    return json.dumps(response.json())

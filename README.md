# AL Challenge
### Overview
Built using Python and the Flask framework, this application provides an interface for The Movie DataBase API and allows for the searching for movies, TV shows, and people.

It also allows for the discovery of new movies released this year organised by highest rated and top trending.

Additional detail for each movie and show can be accessed and presented in a modal view.
### Requirements
The application can be run using Docker.
### Setup
`git clone https://github.com/nmillwater/AL-Challenge.git`

`cd AL-Challenge/`

Before continuing, edit `tmdbAPI.py` and insert an API key into line 6.

`docker build -t al-challenge:latest .`

`docker run -p 5000:5000 al-challenge`

This should result in the Flask application being available by navigating to `http://localhost:5000`
### Design
#### Python and Flask
The application is built using Python and the [Flask](http://flask.pocoo.org "Flask Homepage") framework. Python is a language I am familiar with, and I chose Flask because I wanted to have a way to run searches without the API Key being sent from the user's client.

Flask provides a lightweight web framework, which uses routes to present different resources to the client, depending on the URL path accessed.
The different routes defined for this application can be viewed under `app.py`.
Each route returns either a HTML document produced by the `render_template()` function, or it will return the result of calling a function from `tmdbAPI.py`.

For example, if the user navigates to the path `/` then `app.py` processes `@tmdb_app.route("/")` which returns the result of `render_template("index.html")`.

Routes can pass different arguments across to the `render_template()` function, and this is used to render dynamic content.
Since the API key is stored inside `tmdbAPI.py`, the application can issue requests to the Movie Database API on behalf of the user and pass the results through to the `render_template()` function.
#### JavaScript
JavaScript is used to provide a couple of features to the user.
##### Go to Top
Firstly, it is used to provide the user with a Scroll to Top button, which is rendered when the user has moved away from the top of the document. This improves the user's experience by allowing a quick return to the search field.
##### Discover
The discover page content is rendered using JavaScript and JQuery (`discover.js`), with AJAX requests being issued to the API endpoints of `app.py`. Once these requests are complete and a response is receieved, the HTML of a table is generated, and added to the page.
##### Retrieve Details
`tmdb.js` contains code which interacts with the hidden Modal on the Discover and Search pages.
The `getDetail()` is passed a title ID and category, before it makes an AJAX request to `/api/detail`. Once results are returned, the function then modifies the HTML of the hidden Modal to insert information about the specific movie or TV show. Once the HTML is written the modal is toggled to present the information to the user.

### Challenges
The most influential challenge was around deciding whether to have the search results processed client-side or server-side.

Initially, I built proof of concepts that were all client-side JavaScript and JQuery implementations which interacted with the Movie Database API directly. This of course required the client to have a valid API key, and also meant that dynamic HTML had to be put together and written to the page by the client.

I wanted to seperate the client from the API and so I decided that I needed to build my own API abstraction layer, which resulted in the routes defined in `app.py` and the various functions inside 'tmdAPI.py'.
This resulted in the `search.html` template having a number of logic decisions built in, to help determine if a search had been performed and if the results were valid, and then rendered the results depending on if a movie, TV show, or person was searched for.

I also wanted to make sure that URI parameters were used by the application, so that users can bookmark and share links to the results they are seeing.
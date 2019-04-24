Current Development Notes
=========================

## Backend

- [x] Implement Server Push for comments with Flask (Andrew)
    * Tested with `curl -X GET localhost:8080/commentStream --no-buffer`
    * [Reference](https://stackoverflow.com/questions/12232304/how-to-implement-server-push-in-flask-framework?answertab=active#tab-top)

- [ ] Grab Historical 1-Day Reddit Dataset for a couple of hand selected subreddits and provide endpoint for the data

- [ ] Integrate sentiment classification on comments

## Frontend

- [x] Test client side reception of server push clients with `EventSource` (Andrew)
    * Still some weird react error with non-unique keys in list

- [ ] Provide static `.html` pages with `bootstrap` modeled after mock-up

- [ ] Figure out how to display `.html` with React, or convert `.html` into React code

- [ ] Update render on either reception of stream data or time slider in historical view


Current Development Notes
=========================

## Backend

- [x] Implement Server Push for comments with Flask (Andrew)
    * Tested with `curl -X GET localhost:8080/commentStream --no-buffer`

- [ ] Grab Historical 1-Day Reddit Dataset for a couple of hand selected subreddits and provide endpoint for the data

## Frontend

- [ ] Test client side reception of server push clients with `EventStream`

- [ ] Provide static `.html` pages with `bootstrap` modeled after mock-up

- [ ] Figure out how to display `.html` with React, or convert `.html` into React code

- [ ] Update render on either reception of stream data or time slider in historical view
- [ ] Add the timeseries representation
- [ ] Add info bubble when each point is clicked

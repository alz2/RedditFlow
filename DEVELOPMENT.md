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

- [x] Add the timeseries representation (Andrew)
    * Experimented with [dimple](http://dimplejs.org/examples_viewer.html?id=pie_bubble). I can render a pie for each post although
      the expected data format for the pie chart is unintuitive. I would've wanted something like 
        ```
        {
            postId: {
                postDate: some_date,
                upvotes: n_upvotes,
                pos: n_pos,
                neu: n_neu,
                neg: n_neg
            },
        }

        ```
        but instead I have to store 3 data entries for each post, so like

        ```
            [
                {
                    postId: postId,
                    postDate: postDate,
                    upvotes: n_upvotes,
                    sentimentType: "positive",
                    sentimentCount: n_pos
                },
                {
                    postId: postId,
                    postDate: postDate,
                    upvotes: n_upvotes,
                    sentimentType: "negative",
                    sentimentCount: n_neg
                },
                {
                    postId: postId,
                    postDate: postDate,
                    upvotes: n_upvotes,
                    sentimentType: "neutral",
                    sentimentCount: n_neu
                }
            ]
        ```
    * Update: played around with references so to abstract away data storage with `onCommentRecieve` and `onSubmissionRecieve`.
    * `RedditDayFlow` class abstracts `TimeSeriesPie` given number of rows and dataset.

- [ ] Add info bubble when each point is clicked

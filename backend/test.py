import praw
import json
import flask
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
import os
from nltk.sentiment.vader import SentimentIntensityAnalyzer

app = Flask(__name__)
CORS(app)
load_dotenv()
sid = SentimentIntensityAnalyzer()
reddit = praw.Reddit(client_id=os.environ['client_id'], 
                     client_secret=os.environ['client_secret'],
                     user_agent=os.environ['user_agent'])

def subreddit_comment_stream(name):
    # postId,commentId,author,score,postDate,text,URL,flair,neutralScore,posScore,negScore
    subreddit = reddit.subreddit(name)
    for comment in subreddit.stream.comments(skip_existing=True):
        ss = sid.polarity_scores(comment.body)
        print(comment.body)
        res = {
                "postId": comment.submission.id,
                "commentId": comment.id,
                "author": comment.author.name,
                "score": comment.score,
                "postDate": comment.created_utc,
                "text": comment.body,
                "URL": "",
                "neutralScore": ss['neu'],
                "posScore": ss['pos'],
                "negScore": ss['neg']
                }
        yield("data: " + json.dumps(res) + "\n\n")

def subreddit_submission_stream(name):
    # postId,postTitle,postAuthor,score,postDate,upvoteRatio,URL
    subreddit = reddit.subreddit(name)
    for submission in subreddit.stream.submissions(skip_existing=True):
        res = {
                "postId": submission.id,
                "postTitle": submission.title,
                "postAuthor": submission.author.name,
                "score": submission.score,
                "postDate": submission.created_utc,
                "upvoteRatio": submission.upvote_ratio,
                "URL": submission.url
                }
        yield("data: " + json.dumps(res) + "\n\n")

@app.route('/commentStream')
def comment_stream():
    r = request.args['r']
    return flask.Response(subreddit_comment_stream(r),
                          mimetype="text/event-stream")

@app.route('/submissionStream')
def submission_stream():
    r = request.args['r']
    return flask.Response(subreddit_submission_stream(r),
                          mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(port=8080,
            threaded=True,
            debug=True)

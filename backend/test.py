import praw
import flask
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()
reddit = praw.Reddit(client_id=os.environ['client_id'], 
                     client_secret=os.environ['client_secret'],
                     user_agent=os.environ['user_agent'])

def subreddit_comment_stream(name):
    subreddit = reddit.subreddit('iama')
    for comment in subreddit.stream.comments(skip_existing=True):
        print(comment)
        print(comment.body)
        yield(comment.body)

@app.route('/commentStream')
def comment_stream():
    return flask.Response(subreddit_comment_stream('iama'),
                          mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(port=8080,
            threaded=True,
            debug=True)

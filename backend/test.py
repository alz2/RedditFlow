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
    subreddit = reddit.subreddit('all')
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

@app.route('/commentStream')
def comment_stream():
    return flask.Response(subreddit_comment_stream('iama'),
                          mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(port=8080,
            threaded=True,
            debug=True)

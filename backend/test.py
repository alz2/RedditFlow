import praw
from dotenv import load_dotenv
import os

load_dotenv()
reddit = praw.Reddit(client_id=os.environ['client_id'], 
                     client_secret=os.environ['client_secret'],
                     user_agent=os.environ['user_agent'])

subreddit = reddit.subreddit('iama')
for comment in subreddit.stream.comments(skip_existing=True):
    print(comment)
    print(comment.body)

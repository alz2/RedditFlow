import pandas as pd
import requests
import json
import csv
import time
import datetime
import sys
from nltk.sentiment.vader import SentimentIntensityAnalyzer

print(sys.argv)
def getPushshiftData( after,  sub):
    url = 'https://api.pushshift.io/reddit/search/comment/?subreddit=' + sub + '&size=1000'+'&after=' + after
    r = requests.get(url)
    data = json.loads(r.text)
    return data['data']
def collectSubData(subm,subStats):
	subData = list() #list to store data points

	try:
		flair = subm['link_flair_text']
	except KeyError:
		flair = "NaN"    
	author = subm['author']
	sub_id = subm['id']
	score = subm['score']
	thread = subm['link_id']
	created = datetime.datetime.fromtimestamp(subm['created_utc']) #1520561700.0
	comment_text = subm['body']
	#numComms = subm['num_comments']
	permalink = subm['permalink']
	#get polarity
	sid = SentimentIntensityAnalyzer()
	polarity_scores = sid.polarity_scores(comment_text)
	message_info = {}
	Neutral_score= polarity_scores['neu']
	Pos_score = polarity_scores['pos']
	Neg_score= polarity_scores['neg']

	subData.append((thread, sub_id,author,score,created,comment_text,permalink,flair,Neutral_score,Pos_score,Neg_score))
	subStats[sub_id] = subData
#Subreddit to query
sub = str(sys.argv[1])
#before and after dates
after = '1d'
query = "Screenshot"
subCount = 0
subStats = {}
data = getPushshiftData( after,  sub)


for submission in data:
    collectSubData(submission,subStats)
    subCount+=1
file = 'sample.csv'
if str(sys.argv[2]):
	with open(str(sys.argv[2]), 'w', newline='', encoding='utf-8') as file: 
	    a = csv.writer(file, delimiter=',')
	    headers = ["Post ID","CommentId","Author","Score","Publish Date","Text","URL","Flair","Neutral_score","Pos_score","Neg_score"]
	    a.writerow(headers)
	    for sub in subStats:
	        a.writerow(subStats[sub][0])


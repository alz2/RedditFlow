import pandas as pd
import requests
import json
import csv
import time
import datetime
import sys
from nltk.sentiment.vader import SentimentIntensityAnalyzer

print(sys.argv)
def getPushshiftLink( after,  sub):
    url = 'https://api.pushshift.io/reddit/search/submission/?size=1000&after='+str(after)+'&subreddit='+str(sub)
    r = requests.get(url)
    data = json.loads(r.text)
    return data['data']

def getPushshiftComm( after,  sub):
    url = 'https://api.pushshift.io/reddit/search/comment/?subreddit=' + sub + '&size=1000'+'&after=' + after
    r = requests.get(url)
    data = json.loads(r.text)
    return data['data']


def collectCommData(subm,subStats):
	subData = list() #list to store data points

	try:
		flair = subm['link_flair_text']
	except KeyError:
		flair = "NaN"    
	author = subm['author']
	sub_id = subm['id']
	score = subm['score']
	#thread = subm['link_id']
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
def collectSubData(subm,subStats):
    subData = list() #list to store data points
    #title = subm['title']
    #url = subm['url']
    try:
        flair = subm['link_flair_text']
    except KeyError:
        flair = "NaN"    
    author = subm['author']
    sub_id = subm['id']
    title = subm['title']
    score = subm['score']
    created = datetime.datetime.fromtimestamp(subm['created_utc']) #1520561700.0
    #comment_text = subm['body']
    #numComms = subm['num_comments']
    post_link = subm['full_link']
    permalink = subm['permalink']
    subData.append(( sub_id,title,author,score,created,post_link))
    subStats[sub_id] = subData

#Subreddit to query
sub = 'UIUC'
#before and after dates
after = '2d'
query = "Screenshot"

subStats = {}
subStats_link = {}
data = getPushshiftComm( after,  sub)
data_link = getPushshiftLink( after, sub)
# Will run until all posts have been gathered 
# from the 'after' date up until before date
def str_data(data,t):
    while len(data) > 0:
        for submission in data:
            if t == 0:
                print(len(subStats))
                collectCommData(submission,subStats)
            else:
                collectSubData(submission,subStats)
            
            #subCount+=1
        
        # Calls getPushshiftData() with the created date of the last submission
        print(len(data))
        print(str(datetime.datetime.fromtimestamp(data[-1]['created_utc'])))
        after = data[-1]['created_utc']
        data =getPushshiftsubmission( after, sub)
    return subStats

#For comments
#write_comm = str_data(data,0)
write_link = str_data(data_link,1)

#print(len(data))
def writeFiles(subStats,t):
	#if str(sys.argv[2]):
    with open('sample.csv', 'w', newline='', encoding='utf-8') as file: 
        a = csv.writer(file, delimiter=',')
        if t == 0:
            headers = ["Post ID","CommentId","Author","Score","Publish Date","Text","URL","Flair","Neutral_score","Pos_score","Neg_score"]
        else:
            #sub_id,title,author,score,created,post_link
            headers = ["Post ID","Title","Author","Score","Publish Date","URL"]
        a.writerow(headers)
        for sub in subStats:
            a.writerow(subStats[sub][0])
writeFiles(write_link,1)


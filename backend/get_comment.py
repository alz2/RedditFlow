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
def collectCommData(subm):
    subData = list() #list to store data points

    try:
        flair = subm['link_flair_text']
    except KeyError:
        flair = "NaN"    
    author = subm['author']
    
    sub_id = subm['id']
    score = subm['score']
    thread = subm['link_id']
    link_id_list.append(thread[3:])
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
sub = 'UIUC'
#before and after dates
after = '1d'
subCount = 0
subStats = {}
subStats_link = {}
data = getPushshiftData( after,  sub)
link_id_list = []
# Will run until all posts have been gathered 
# from the 'after' date up until before date

while len(data) > 0:
    for submission in data:
        collectCommData(submission)
        subCount+=1
    # Calls getPushshiftData() with the created date of the last submission
    print(len(data))
    print(str(datetime.datetime.fromtimestamp(data[-1]['created_utc'])))
    after = str(data[-1]['created_utc'])
    print (after)
    data = getPushshiftData( after, sub)
    
print(len(data))

#print(len(data))
def writeFiles(subStats):
    with open('sample.csv', 'w', newline='', encoding='utf-8') as file: 
        a = csv.writer(file, delimiter=',')
        headers = ["Post ID","CommentId","Author","Score","Publish Date","Text","URL","Flair","Neutral_score","Pos_score","Neg_score"]
        a.writerow(headers)
        for sub in subStats:
            a.writerow(subStats[sub][0])
writeFiles(subStats)

def get_link_det(link_l ):
    output= []
    for l in link_l:
        sr = reddit.submission(l)
        output.append([sr.id,sr.title,sr.author,sr.score,sr.created_utc,sr.upvote_ratio,sr.url])
        
        #print(subreddit.score)
    return output
output = get_link_det(link_id_list )
with open('sample_link.csv', 'w', newline='', encoding='utf-8') as file: 
    a = csv.writer(file, delimiter=',')
    headers = ["Link ID","Name","Author","Score","Publish Date","Upvote Ratio","URL"]
    a.writerow(headers)
    for sub in output:
        a.writerow(sub)


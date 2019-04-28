import pandas as pd
import sys


data = pd.read_csv(sys.argv[1])

df2 = pd.melt(data[["PostID","CommentId","Author","URL","PublishDate","Pos_score","Neg_score","Neutral_score"]], id_vars=["PostID", "CommentId","Author","URL","PublishDate"], 
                  var_name="sentimentType", value_name="Value")
df2.to_csv('Data_vis/' + sys.argv[1][9:] )

import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["b12j"]

# for col in mydb.list_collection_names():
#     mydb[col].drop()
print(mydb.list_collection_names())
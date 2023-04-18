#Flask App to serve a JS visualization
 
from flask import Flask
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson.json_util import dumps

#################################################
# Load Data
#################################################
#Import csv to mongo with: mongoimport --type csv -d PublicSchool2021 -c characteristics --headerline --drop Compiled_Public_School_Characteristics.csv
# Connect to YOUR database here...
# To keep this example simple, I'm just loading a data.json file 
# But for your project, this is where the database connection should go
mongo = MongoClient(port=27017)
db = mongo['PublicSchool2021']
characteristics = db['characteristics']
app = Flask(__name__)
CORS(app, support_credentials=True)   # to prevent CORS errors


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        # f"/api/v1.0/school_data<br/>"
        f"<a href='/api/v1.0/school_data'>/api/v1.0/school_data</a></br>"
    )

@app.route("/api/v1.0/school_data")
@cross_origin(supports_credentials=True)  # to prevent CORS errors
def school_data():

    results = characteristics.find({},{'_id':False})
    return dumps(results)


if __name__ == '__main__':
    app.run(debug=True)
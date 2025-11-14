

from flask import Flask , render_template, request,flash,redirect,url_for
from sqlalchemy import select
import os
import csv
# render_template is used for return the html page
# request is functions to check the methods of communication
# flash is used when we want to give reaction to user when he/she did something



app = Flask(__name__)

# for save the cookie message
app.secret_key = 'dev'

# register a request function,
# and we bind with this url path with a function. 
# click the url will trigger the function. 
@app.route('/home')
@app.route('/picture')
def hello():
    return '<h1>Hello World!</h1><img src="static/logo.png">'

# in the path url, we can add parameters 
@app.route('/fiction/<fiction_name>')
def show_user_profile(fiction_name):
        return f'<h1> This page is about {fiction_name}!</h1>'

# Jinja2 will be used in html to access the variables in flask 
#1. {{ ... }} marks the variables
#2. {% ... %} marks sentence of logis, such as if, for 
#3. {# ... #} marks the comments
#4. {{ Variable|Filter }}

name = 'Harry'
movies = [
    {'title': 'My Neighbor Totoro', 'year': '1988'},
    {'title': 'Dead Poets Society', 'year': '1989'},
    {'title': 'A Perfect World', 'year': '1993'},
    {'title': 'Leon', 'year': '1994'},
    {'title': 'Mahjong', 'year': '1996'},
    {'title': 'Swallowtail Butterfly', 'year': '1996'},
    {'title': 'King of Comedy', 'year': '1999'},
    {'title': 'Devils on the Doorstep', 'year': '1999'},
    {'title': 'WALL-E', 'year': '2008'},
    {'title': 'The Pork of Music', 'year': '2012'},
]
# We did the following thing in index.html: 
# 1. add the fav con in the <head> use <link> 
# 2. add css
# 3. use url_for() to acquire the link in your path file
# 4. add a external IMDB link in the home page
# 5. add a form for user to type and allows for post 
@app.route('/') 
def index():
    return render_template('index.html', name=name, movies=movies)


CSV_FILE = os.path.join('data', 'df_MagnusMoves.csv')
@app.route('/edit', methods=['GET', 'POST']) # GET is to click the url and get the pages, and post is for submit new data and save 
def edit():
    # save the user form into csv, we will replace it with function of db later
    if request.method == 'POST':
        title = request.form.get('MagnusSide').strip()
        year = request.form.get('MagnusTimeLeft').strip()
        title = request.form.get('OpponentTimeLeft').strip()
        year = request.form.get('Phase').strip()
        title = request.form.get('TimeTotal').strip()
        year = request.form.get('Increment').strip()
        title = request.form.get('IsVariantWin').strip()
        year = request.form.get('IsCaptured').strip()


        #write to csv
        file_exists = os.path.isfile(CSV_FILE)
        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(['Title', 'Year'])
            writer.writerow([title, year])
        flash('Movie added successfully!')
        # use re-direct to refresh the page get the new data
        return redirect(url_for('edit'))
    
    #read csv to update information in the page
    #this will be replaced by functions of db later 
    movies = []
    if os.path.isfile(CSV_FILE):
        with open(CSV_FILE, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            movies = list(reader)
    return render_template('edit.html', name=name, movies=movies)


# write a unique 404 page
@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404
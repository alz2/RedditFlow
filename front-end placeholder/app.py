from flask import Flask, abort, request, jsonify, render_template, redirect, url_for, session

import json, re


app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def main():
    #return "Hello World!"
    return render_template('main.html')

@app.route('/', methods = ["POST"])
def admin_post():
    #Moving forward code
    return render_template('main.html')

if __name__ == '__main__':

	app.run(debug = True)


from flask import Flask, render_template, json, jsonify, request
import hashlib
import sqlite3

user = ""
passw = ""
passw_enc = ""

app = Flask(__name__, template_folder="templates", static_folder="static")

@app.route("/")
def index():
    return render_template("logup.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if not request.json:
        print("no json")
    elif "data" not in request.json:
        print("no data in json")
    else:
        global user
        global passw
        global passw_enc
        conn = sqlite3.connect("userdata.db")
        cur = conn.cursor()
        cur.execute("CREATE TABLE IF NOT EXISTS userdata(user, passw_enc, classList)")
        data = request.json["data"]
        user = data[0]
        passw = data[1]
        passw_enc = bytes(str(passw), encoding="utf-8")
        passw_enc = hashlib.sha256(passw_enc, usedforsecurity=True).hexdigest()
        if (user,) in cur.execute("SELECT user FROM userdata WHERE (user, passw_enc) = (?, ?)", (user, passw_enc)).fetchall():
            print("This user already exists")
            return jsonify({"message":"This user already exists."})
        else:
            classList = json.dumps([[]])
            cur.execute("INSERT INTO userdata VALUES (?, ?, ?)", (user, passw_enc, classList))
            conn.commit()
            conn.close()
            return jsonify({"message":"euge"})
        
@app.route("/login", methods=["GET", "POST"])
def login():
    if not request.json:
        print("no request")
    elif "data" not in request.json:
        print("no data in request")
    else:
        global user
        global passw
        global passw_enc

        conn = sqlite3.connect("userdata.db")
        cur = conn.cursor()
        data = request.json["data"]
        user = data[0]
        passw = data[1]
        passw_enc = bytes(str(passw), encoding="utf-8")
        passw_enc = hashlib.sha256(passw_enc, usedforsecurity=True).hexdigest()
        if (user, ) not in cur.execute("SELECT user FROM userdata").fetchall():
            print("user does not exist")
            return jsonify({"message":"This user does not exist."})
        elif (user, passw_enc) not in cur.execute("SELECT user, passw_enc FROM userdata").fetchall():
            print("incorrect password")
            return jsonify({"message":"Incorrect password."})
        else:
            print("success!")
            return jsonify({"message": "euge", "rdrct":"/main"})
        
@app.route("/main")
def main():
    global user
    global passw_enc
    conn = sqlite3.connect("userdata.db")
    curr = conn.cursor()
    classes = json.loads(curr.execute("SELECT classList FROM userdata WHERE (user, passw_enc) = (?,?)", (user, passw_enc)).fetchone()[0])
    print(classes)
    return render_template("main.html", user=user, classes=classes)

@app.route("/save", methods=["GET", "POST"])
def save():
    if not request.json:
        print("no request")
    elif "data" not in request.json:
        print("no data")
    else:
        global user
        global passw_enc
        conn = sqlite3.connect("userdata.db")
        cur = conn.cursor()
        data = request.json["data"]
        print(data)
        cur.execute("UPDATE userdata SET classList = ? WHERE (user, passw_enc) = (?, ?)", (json.dumps(data), user, passw_enc))
        conn.commit()
        conn.close()
        return "success"

app.run(debug=True, host="0.0.0.0", port=8080)
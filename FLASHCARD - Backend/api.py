from email import message
from urllib import response
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from numpy import delete
from sqlalchemy import create_engine
from sqlalchemy import func
from sqlalchemy import and_

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from datetime import datetime

from cryptography.fernet import Fernet

engine = create_engine('sqlite:///FlashcardDB.db')

app = Flask(__name__)
api = Api(app)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///FlashcardDB.db'
db = SQLAlchemy()
db.init_app(app)
app.app_context().push()

app.config["JWT_SECRET_KEY"] = "cf02f60129a3ba111e7bbe1d78467455"  # Change this!
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'query_string']
jwt = JWTManager(app)

class uDetails(db.Model):
    __tablename__ = "uDetails"
    uID = db.Column(db.Integer, primary_key = True)
    fName = db.Column(db.String, nullable = False)
    pwd = db.Column(db.String, nullable = False)
    enKey = db.Column(db.String, nullable = False)
    lastVisited = db.Column(db.String, nullable = False)

    def __init__(self, a, b, c, d, e):
        self.uID = a
        self.fname = b
        self.pwd = c
        self.enKey = d
        self.lastVisited = e

class uName(db.Model):
    __tablename__ = "uName"
    uID = db.Column(db.Integer, db.ForeignKey("uDetails.uID"), primary_key = True)
    username = db.Column(db.String, nullable = False, unique = True)

    def _init_(self, a, b):
        self.uID = a
        self.username = b

class uEmail(db.Model):
    __tablename__ = "uEmail"
    uID = db.Column(db.Integer, db.ForeignKey("uDetails.uID"), primary_key = True)
    email = db.Column(db.String, nullable = False, unique = True)

    def _init_(self, a, b):
        self.uID = a
        self.email = b

class uDeck(db.Model):
    __tablename__ = "uDeck"
    uID = db.Column(db.Integer, db.ForeignKey("uDetails.uID"), unique = True, primary_key = True)
    dID = db.Column(db.Integer, unique = True, primary_key = True)
    dName = db.Column(db.String, nullable = False)


    def __init__(self, a, b, c):
        self.uID = a
        self.dID = b
        self.dName = c

class qDeck(db.Model):
    __tablename__ = "qDeck"
    qID = db.Column(db.Integer, primary_key = True)
    dID = db.Column(db.Integer, db.ForeignKey("uDeck.dID"), nullable = False)

    def __init__(self, a, b):
        qID = a
        dID = b

class questionAnswer(db.Model):
    __tablename__ = "questionAnswer"
    qID = db.Column(db.Integer, db.ForeignKey("qDeck.qID"), primary_key = True)
    question = db.Column(db.String, nullable = False)
    answer = db.Column(db.String, nullable = False)

    def __init__(self, a, b, c):
        self.qID = a
        self.question = b
        self.answer = c

class qStat(db.Model):
    __tablename__ = "qStat"
    qID = db.Column(db.Integer, db.ForeignKey("qDeck.qID"), primary_key = True)
    easy = db.Column(db.Integer, nullable = False)
    medium = db.Column(db.Integer, nullable = False)
    hard = db.Column(db.Integer, nullable = False)
    attempts = db.Column(db.Integer, nullable = False)

    def __init__(self, a, b = 0, c = 0, d = 0, e = 0):
        self.qID = a
        self.easy = b
        self.medium = c
        self.hard = d
        self.attempts = e

#----------------------------------------------------------------------------------------------------------------

def isValidUsername(s):
    special_characters = "\!@#$%^&*()-+?_=,<>/'"

    if len(s) >= 5:
        for i in s:
            if i in special_characters:
                return False
    else:
        return False

    return True

def isValidPassword(s):
    if len(s) >= 8:
        for i in s:
            if i.isupper():
                return True
    return False

#---------------------------------------------------------------------------------------------------------------

class Login(Resource):
    def post(self):
        data = request.get_json(force=True)

        username =data["username"]
        password = data["password"]

        q = uName.query.all()
        
        t = 0
        for i in q:
            if i.username == username:
                t = 1

                r = uDetails.query.filter_by(uID=i.uID).all()

                key = bytes(r[0].enKey, "utf-8")
                cipher_suite = Fernet(key)
                checkPassword = bytes(r[0].pwd, "utf-8")
                checkPassword = cipher_suite.decrypt(checkPassword)
                checkPassword = checkPassword.decode("utf-8")

                if checkPassword == password:
                    lastVisited = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

                    previousVisit = r[0].lastVisited

                    r[0].lastVisited = lastVisited
                    db.session.commit()

                    access_token = create_access_token(identity=i.uID)
                   
                    response = jsonify({"message" : "login success",
                                        "access_token": access_token})

                    response.status_code = 400
                    
                    return response
                else:
                    response = jsonify({"message" : "INVALID USERNAME OR PASSWORD!"})
                    response.status_code = 201
                    
                    return response
        if t == 0:
            response = jsonify({"message" : "INVALID USERNAME OR PASSWORD!"})
            response.status_code = 201
                    
            return response
    
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()

        response = jsonify({"uID" : str(current_user)})
        response.status_code = 400

        return response

#----------------------------------------------------------------------------------------------------------------

class Signup(Resource):
    def post(self):
        data = request.get_json(force=True)
        
        username = data["username"]
        name = data["name"]
        password = data["password"]
        email = data["email"]

        if isValidUsername(username):
                if isValidPassword(password):
                        q = uName.query.all()

                        for i in q:
                            if i.username == username:
                                response = jsonify({"message": "USER ALREADY EXISTS !"})
                                response.status_code = 201
        
                                return response

                        q = uEmail.query.all()

                        for i in q:
                            if i.email == email:
                                response = jsonify({"message": "EMAIL ALREADY EXISTS !"})
                                response.status_code = 201
        
                                return response


                else:
                    response = jsonify({"message": "Password: Atleast 8 characters. Atleast one character in Uppercase!"})
                    response.status_code = 201
        
                    return response
        else:
            response = jsonify({"message": "Username: Atleast 5 characters. No special characters allowed!"})
            response.status_code = 201
        
            return response
        
        key = Fernet.generate_key()
        cipher_suite = Fernet(key)
        password = bytes(password, "utf-8")
        password = cipher_suite.encrypt(password)
        password = password.decode("utf-8")
        
        key = key.decode("UTF-8")

        lastVisited = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        uID = db.session.query(func.max(uDetails.uID)).scalar()

        if uID == None:
            uID = 0

        uID = int(uID) + 1

        sq = "INSERT INTO \"uDetails\" VALUES (" + str(uID) + ", '" + str(name) + "', '" + str(password) + "', '" + str(key) + "', '" + str(lastVisited) + "');"
        with engine.connect() as con:
            con.execute(sq)
        db.session.commit()

        sq = "INSERT INTO \"uName\" VALUES (" + str(uID) + ", '" + str(username) + "');"
        with engine.connect() as con:
            con.execute(sq)
        db.session.commit()

        sq = "INSERT INTO \"uEmail\" VALUES ("+str(uID)+", '"+str(email)+"');"
        with engine.connect() as con :
            con.execute(sq)
        db.session.commit()
                
        response = jsonify({"message": "Success"})
        response.status_code = 400
        return response
#-----------------------------------------------------------------------------------------------------------------

class Deck(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json(force=True)
        uID = get_jwt_identity()

        deckName = data["deckName"]

        q = db.session.query(func.max(uDeck.dID)).scalar()

        if q == None:
            q = 0

        q = int(q) + 1

        sq = "INSERT INTO \"uDeck\" VALUES (" + str(uID) + ", " + str(q) + ", '" + str(deckName) + "');"
        with engine.connect() as con:
            con.execute(sq)
        db.session.commit()

        title = "DECK ADDED"
        msgDisp = "DECK ADDED SUCCESSFULLY"

        response = jsonify({"message": "Deck added Successfully"})
        response.status_code = 400

        return response

    @jwt_required()
    def get(self):
        uID = get_jwt_identity()

        q = uDeck.query.filter_by(uID=int(uID)).all()

        if(len(q) == 0):
            response = jsonify({"message" : "No Decks Available"})
            response.status_code = 400

            return response

        l = []
        for i in q:
            temp = {}
            temp[str(i.dID)] = str(i.dName)
            l.append(temp)

        response = jsonify({"message": l})
        response.status_code = 400

        return response

    @jwt_required()
    def put(self):
        data = request.get_json(force=True)
        uID = get_jwt_identity()

        dID = data["dID"]
        newDeckName = data["newDeckName"]

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)):
                i.dName = newDeckName
                db.session.commit()

                response = jsonify({"message": "Name changed Successfully"})
                response.status_code = 400

                return response

        response = jsonify({"message": "Name change Failed"})
        response.status_code = 201

        return response
    
    @jwt_required()
    def delete(self):
        data = request.get_json(force=True)
        uID = get_jwt_identity()

        dID = data["dID"]

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)):
                sq = "DELETE FROM \"uDeck\" WHERE \"dID\" = " + str(dID) + ";"
                with engine.connect() as con:
                    con.execute(sq)
                db.session.commit()

                q = qDeck.query.filter_by(dID = int(dID)).all()

                qns = []
                for i in q:
                    qns.append(i.qID)

                sq = "DELETE FROM \"qDeck\" WHERE \"dID\" = " + str(dID) + ";"
                with engine.connect() as con:
                    con.execute(sq)
                db.session.commit()

                print(qns)
                for i in qns:
                    sq = "DELETE FROM \"qStat\" WHERE \"qID\" = " + str(i) + ";"
                    with engine.connect() as con:
                        con.execute(sq)
                    db.session.commit()

                    sq = "DELETE FROM \"questionAnswer\" WHERE \"qID\" = " + str(i) + ";"
                    with engine.connect() as con:
                        con.execute(sq)
                    db.session.commit()

                response = jsonify({"message": "Deck Deleted Successfully"})
                response.status_code = 400

                return response

        response = jsonify({"message": "Deck Delete Unsuccessfull"})
        response.status_code = 201

        return response
#-----------------------------------------------------------------------------------------------------------------

class getCard(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        uID = get_jwt_identity()

        dID = data["dID"]

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)):
                q = qDeck.query.filter_by(dID = int(dID)).all()

                qns = []
                for i in q:
                    qns.append(i.qID)

                q = questionAnswer.query.filter(questionAnswer.qID.in_(qns)).all()

                if(len(q) == 0):
                    response = jsonify({"message" : "No Cards Available"})
                    response.status_code = 400

                    return response

                l = []
                for i in q:
                    temp = {}
                    temp[str(i.qID)] = {"question": i.question,
                                        "answer": i.answer}
                    l.append(temp)

                response = jsonify({"message": l})
                response.status_code = 400

                return response
        
        response = jsonify({"message": "Unsuccessfull"})
        response.status_code = 201

        return response

class Card(Resource):
    @jwt_required()
    def get(self):
        data = request.get_json()
        uID = get_jwt_identity()

        dID = data["dID"]

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)):
                q = qDeck.query.filter_by(dID = int(dID)).all()

                qns = []
                for i in q:
                    qns.append(i.qID)

                q = questionAnswer.query.filter(questionAnswer.qID.in_(qns)).all()

                if(len(q) == 0):
                    response = jsonify({"message" : "No Cards Available"})
                    response.status_code = 400

                    return response

                l = []
                for i in q:
                    temp = {}
                    temp[str(i.qID)] = {"question": i.question,
                                        "answer": i.answer}
                    l.append(temp)

                response = jsonify({"message": l})
                response.status_code = 400

                return response
        
        response = jsonify({"message": "Unsuccessfull"})
        response.status_code = 201

        return response


    @jwt_required()
    def post(self):
        data = request.get_json(force=True)
        uID = get_jwt_identity()

        front = data["question"]
        back = data["answer"]
        dID = data["dID"]

        q = db.session.query(func.max(qDeck.qID)).scalar()

        if q == None:
            q = 0
            QnID = 0

        QnID = int(q) + 1

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)):       
                sq = "INSERT INTO \"qDeck\" VALUES (" + str(QnID) + ", " + str(dID) + ");"
                with engine.connect() as con:
                    con.execute(sq)
                db.session.commit()

                sq = "INSERT INTO \"questionAnswer\" VALUES (" + str(QnID) + ", '" + str(front) + "', '" + str(back) + "');"
                with engine.connect() as con:
                    con.execute(sq)
                db.session.commit()

                sq = "INSERT INTO \"qStat\" VALUES (" + str(QnID) + ", " + str("0") + ", " + str("0") + ", " + str("0") + ", " + str("0") +");"
                with engine.connect() as con:
                    con.execute(sq)
                db.session.commit()

                response = jsonify({"message": "Card Added Successfully"})
                response.status_code = 400

                return response
        
        response = jsonify({"message": "Card Add Unsuccessfull"})
        response.status_code = 201

        return response

    @jwt_required()
    def put(self):
        data = request.get_json()
        uID = get_jwt_identity()

        qID = data["qID"]
        newFront = data["question"]
        newBack = data["answer"]

        q = qDeck.query.filter_by(qID=qID)
        dID = q[0].dID

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)): 
                q = questionAnswer.query.filter_by(qID=qID)

                q[0].question = newFront
                q[0].answer = newBack
                db.session.commit()

                response = jsonify({"message": "CARD EDITED SUCCESSFULLY"})
                response.status_code = 400

                return response

        response = jsonify({"message": "CARD EDIT UNSUCCESSFULL"})
        response.status_code = 201

        return response

    @jwt_required()
    def delete(self):
        data = request.get_json()
        uID = get_jwt_identity()

        qID = data["qID"]

        q = qDeck.query.filter_by(qID=qID)
        dID = q[0].dID

        q = uDeck.query.filter_by(uID=int(uID)).all()

        for i in q:
            if(int(i.dID) == int(dID)): 
                sq = "DELETE FROM \"qDeck\" WHERE \"qID\" = " + str(qID) + ";"
                with engine.connect() as con:
                    con.execute(sq)
                db.session.commit()

                sq = "DELETE FROM \"questionAnswer\" WHERE \"qID\" = "+str(qID)+";"
                with engine.connect() as con :
                    con.execute(sq)
                db.session.commit()

                sq = "DELETE FROM \"qStat\" WHERE \"qID\" = "+str(qID)+";"
                with engine.connect() as con :
                    con.execute(sq)
                db.session.commit()

                response = jsonify({"message": "CARD DELETED SUCCESSFULLY"})
                response.status_code = 400

                return response
        
        response = jsonify({"message": "CARD DELETE UNSUCCESSFULL"})
        response.status_code = 201

        return response
#-----------------------------------------------------------------------------------------------------------------

class User(Resource):
    @jwt_required()
    def get(self):
        uID = get_jwt_identity()

        q = uDetails.query.filter_by(uID=int(uID)).all()
        name = q[0].fName
    
        q = uEmail.query.filter_by(uID = int(uID)).all()
        email = q[0].email

        q = uName.query.filter_by(uID = int(uID)).all()
        username = q[0].username

        q = uDeck.query.filter_by(uID=int(uID)).all()

        nd = len(q)

        response = jsonify({"name": name,
                            "username": username,
                            "email": email,
                            "nod": nd})
        response.status_code = 400
        return response

    @jwt_required()
    def put(self):
        uID = get_jwt_identity()
        data = request.get_json()

        name = data["name"]
        email = data["email"]
        username = data["username"]
        newPassword = data["password"]

        if isValidUsername(username):
                q = uName.query.all()

                for i in q:
                    if ((i.username == username) and (i.uID != uID)):
                        response = jsonify({"message": "USER ALREADY EXISTS !"})
                        response.status_code = 201

                        return response

                q = uEmail.query.all()

                for i in q:
                    if ((i.email == email)  and (i.uID != uID)):
                        response = jsonify({"message": "EMAIL ALREADY EXISTS !"})
                        response.status_code = 201

                        return response
        else:
            response = jsonify({"message": "Atleast 5 characters. No special characters allowed !"})
            response.status_code = 201

            return response
        
        q = uDetails.query.filter_by(uID=int(uID)).all()

        if isValidPassword(newPassword):
            key = Fernet.generate_key()
            cipher_suite = Fernet(key)
            password = bytes(newPassword, "utf-8")
            password = cipher_suite.encrypt(password)
            password = password.decode("utf-8")

            q[0].pwd = password
            db.session.commit()

            key = key.decode("utf-8")
            q[0].enKey = key
            db.session.commit()
        else:
            response = jsonify({"message": "Password: Atleast 8 characters. Atleast one character in Uppercase!"})
            response.status_code = 201

            return response

        q = uDetails.query.filter_by(uID=int(uID)).all()
        q[0].fName = name
        db.session.commit()

        q = uEmail.query.filter_by(uID = int(uID)).all()
        q[0].email = email
        db.session.commit()

        q = uName.query.filter_by(uID = int(uID)).all()
        q[0].username = username
        db.session.commit()

        response = jsonify({"message": "Changes made successfully"})
        response.status_code = 400

        return response

#-----------------------------------------------------------------------------------------------------------------

class Stat(Resource):
    @jwt_required()
    def post(self):
        uID = get_jwt_identity()
        data = request.get_json()

        i = data["message"]

        p = qStat.query.filter_by(qID=int(i["qID"])).all()

        p[0].attempts = p[0].attempts + 1
        p[0].easy = p[0].easy + int(i["Easy"])
        p[0].medium = p[0].medium + int(i["Medium"])
        p[0].hard = p[0].hard + int(i["Hard"])
        db.session.commit()

        response = jsonify({"message": "Success"})
        response.status_code = 400

        return response
    @jwt_required()
    def get(self):
        uID = get_jwt_identity()
        q = uDeck.query.filter_by(uID=int(uID)).all()

        decks = []
        for i in q:
            decks.append(i.dID)

        q = qDeck.query.filter(qDeck.dID.in_(decks)).all()

        qns = []
        for i in q:
            qns.append(i.qID)

        q = qStat.query.filter(qStat.qID.in_(qns)).all()

        values = {}
        values["EASY"] = 0
        values["MEDIUM"] = 0
        values["HARD"] = 0
        values["ATTEMPTED"] = 0

        for i in q:
            values["EASY"] += i.easy
            values["MEDIUM"] += i.medium
            values["HARD"] += i.hard
            values["ATTEMPTED"] += i.attempts

        response = jsonify(values)
        response.status_code = 400

        return response

#-----------------------------------------------------------------------------------------------------------------
api.add_resource(Login, "/api/login")
api.add_resource(Signup, "/api/signup")
api.add_resource(Deck, "/api/deck")
api.add_resource(Card, "/api/card")
api.add_resource(User, "/api/user")
api.add_resource(Stat, "/api/stat")
api.add_resource(getCard, "/api/getCard")
#------------------------------------------------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(debug=True)
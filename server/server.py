from flask import Flask, jsonify, request
from controller import get_professor_ctrl

app = Flask(__name__)

@app.route('/professor_data', methods=['GET'])
def get_professor_data():
    response = jsonify(get_professor_ctrl(request.args.get("school"), request.args.get("name")))
    return response
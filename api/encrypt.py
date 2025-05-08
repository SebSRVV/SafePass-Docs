from flask import Request, jsonify

def handler(request: Request):
    return jsonify({ "message": "¡Backend Flask funciona con éxito!" })

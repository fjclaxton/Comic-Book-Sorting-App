import json
import os
import bcrypt # You will need to add this to requirements.txt
from pymongo import MongoClient

client = MongoClient(os.environ.get('MONGO_URI'))
db = client['ComicCollectors']

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    email = body.get('email')
    username = body.get('username')
    password = body.get('password')

    # 1. Basic validation
    if not email or not password:
        return {'statusCode': 400, 'body': json.dumps({'message': 'Missing fields'})}

    # 2. Check if user exists
    if db.users.find_one({"$or": [{"email": email}, {"username": username}]}):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Username or Email already exists'})
        }

    # 3. HASH THE PASSWORD
    # Convert password to bytes, generate salt, and hash
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)

    # 4. Save to DB (Store hashed_password as bytes or string)
    new_user = {
        "username": username,
        "email": email,
        "password": hashed_password.decode('utf-8'), # Decode to store as string in Mongo
        "created_at": "2026-04-26" 
    }
    
    db.users.insert_one(new_user)

    return {
        'statusCode': 201,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'User created successfully!'})
    }
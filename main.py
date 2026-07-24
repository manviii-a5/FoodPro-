from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import certifi
import os
from huggingface_hub import InferenceClient

load_dotenv()
hf_client = InferenceClient(token=os.getenv("HF_API_TOKEN"))
app = FastAPI(title="FoodPro API", version="2.0.0")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
db = client.foodpro
products_collection = db.products
users_collection = db.users

# --- Password hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# --- JWT config ---
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 7

def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(days=JWT_EXPIRE_DAYS)
    payload = {"sub": user_id, "email": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        email = payload.get("email")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": email}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def product_helper(product) -> dict:
    return {
        "id": str(product["_id"]),
        "name": product["name"],
        "ingredients": product["ingredients"],
        "weight": product["weight"],
        "features": product["features"],
        "tone": product["tone"],
        "description": product.get("description", ""),
    }
class DescriptionRequest(BaseModel):
    name: str
    ingredients: str
    weight: str
    features: str
    tone: str
class Product(BaseModel):
    name: str
    ingredients: str
    weight: str
    features: str
    tone: str
    description: Optional[str] = ""

class UpdateProduct(BaseModel):
    name: Optional[str] = None
    ingredients: Optional[str] = None
    weight: Optional[str] = None
    features: Optional[str] = None
    tone: Optional[str] = None
    description: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    email: str
    password: str

@app.on_event("startup")
async def startup_event():
    try:
        count = await products_collection.count_documents({})
        if count == 0:
            sample_products = [
                {
                    "name": "Himalayan Wildflower Honey",
                    "ingredients": "Pure wild honey",
                    "weight": "500g",
                    "features": "Raw, unprocessed, forest-sourced",
                    "tone": "Premium",
                    "description": "Experience the pristine purity of raw wildflower honey."
                },
                {
                    "name": "Mountain Ghee",
                    "ingredients": "Cow milk",
                    "weight": "1kg",
                    "features": "Hand-churned, grass-fed cows",
                    "tone": "Traditional",
                    "description": "Made the traditional way from grass-fed cows."
                },
            ]
            await products_collection.insert_many(sample_products)
    except Exception as e:
        print(f"Database warning: {e}")

@app.get("/")
async def root():
    return {"message": "FoodPro API is running!", "version": "2.0.0", "database": "MongoDB Atlas"}

# --- Auth routes ---
@app.post("/api/auth/register")
@limiter.limit("5/minute")
async def register(request: Request, user: UserRegister):
    existing = await users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    result = await users_collection.insert_one({"email": user.email, "password": hashed})
    token = create_access_token(str(result.inserted_id), user.email)
    return {"status": "success", "data": {"token": token, "email": user.email}}

@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, user: UserLogin):
    existing = await users_collection.find_one({"email": user.email})
    if not existing or not verify_password(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(str(existing["_id"]), user.email)
    return {"status": "success", "data": {"token": token, "email": user.email}}

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"status": "success", "data": current_user}

# --- Product routes ---

@app.get("/api/products/search/query")
async def search_products(q: str):
    products = []
    async for product in products_collection.find({
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"tone": {"$regex": q, "$options": "i"}}
        ]
    }):
        products.append(product_helper(product))
    return {"status": "success", "data": products, "count": len(products)}

@app.get("/api/products")
async def get_products(current_user: dict = Depends(get_current_user)):
    products = []
    async for product in products_collection.find({"user_id": current_user["user_id"]}):
        products.append(product_helper(product))
    return {"status": "success", "data": products, "count": len(products)}

@app.post("/api/products", status_code=201)
async def create_product(product: Product, current_user: dict = Depends(get_current_user)):
    new_product = product.dict()
    new_product["user_id"] = current_user["user_id"]
    result = await products_collection.insert_one(new_product)
    created = await products_collection.find_one({"_id": result.inserted_id})
    return {"status": "success", "data": product_helper(created)}

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, updated: UpdateProduct, current_user: dict = Depends(get_current_user)):
    try:
        product = await products_collection.find_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.get("user_id") != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to modify this product")
    update_data = {k: v for k, v in updated.dict().items() if v is not None}
    await products_collection.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    refreshed = await products_collection.find_one({"_id": ObjectId(product_id)})
    return {"status": "success", "data": product_helper(refreshed)}

@app.delete("/api/products/{product_id}", status_code=204)
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    try:
        product = await products_collection.find_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.get("user_id") != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    await products_collection.delete_one({"_id": ObjectId(product_id)})
    return None

@app.get("/api/tones")
async def get_tones():
    return {"status": "success", "data": ["Premium", "Traditional", "Health-Focused"]}

# --- AI routes ---
@app.post("/api/ai/generate-description")
@limiter.limit("10/minute")
async def generate_description(request: Request, data: DescriptionRequest, current_user: dict = Depends(get_current_user)):
    prompt = f"""Write a compelling product description for a food product, in a {data.tone} tone.

Product name: {data.name}
Key ingredients: {data.ingredients}
Weight/size: {data.weight}
Key features: {data.features}

Write 2-3 sentences. Do not include the product name as a heading, just the description text."""

    try:
        response = hf_client.chat.completions.create(
        model="openai/gpt-oss-120b:cerebras",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
        )
        generated_text = response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {str(e)}")

    return {"status": "success", "data": {"description": generated_text}}

   
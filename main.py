from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv
import certifi
import os

load_dotenv()

app = FastAPI(title="FoodPro API", version="2.0.0")

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

@app.get("/api/products")
async def get_products():
    products = []
    async for product in products_collection.find():
        products.append(product_helper(product))
    return {"status": "success", "data": products, "count": len(products)}

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

@app.get("/api/products/{product_id}")
async def get_product(product_id: str):
    try:
        product = await products_collection.find_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success", "data": product_helper(product)}

@app.post("/api/products", status_code=201)
async def create_product(product: Product):
    new_product = product.dict()
    result = await products_collection.insert_one(new_product)
    created = await products_collection.find_one({"_id": result.inserted_id})
    return {"status": "success", "data": product_helper(created)}

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, updated: UpdateProduct):
    try:
        update_data = {k: v for k, v in updated.dict().items() if v is not None}
        result = await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )
    except:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    return {"status": "success", "data": product_helper(product)}

@app.delete("/api/products/{product_id}", status_code=204)
async def delete_product(product_id: str):
    try:
        result = await products_collection.delete_one({"_id": ObjectId(product_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid product ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return None

@app.get("/api/tones")
async def get_tones():
    return {"status": "success", "data": ["Premium", "Traditional", "Health-Focused"]}
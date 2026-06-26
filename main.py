from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid

app = FastAPI(title="FoodPro API", version="1.0.0")

# CORS - allows frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory data store (Week 4 uses this, Week 5 will use MongoDB)
products = [
    {
        "id": "1",
        "name": "Himalayan Wildflower Honey",
        "ingredients": "Pure wild honey",
        "weight": "500g",
        "features": "Raw, unprocessed, forest-sourced",
        "tone": "Premium",
        "description": "Experience the pristine purity of raw wildflower honey harvested from untouched forests of Uttarakhand."
    },
    {
        "id": "2",
        "name": "Mountain Ghee",
        "ingredients": "Cow milk",
        "weight": "1kg",
        "features": "Hand-churned, grass-fed cows",
        "tone": "Traditional",
        "description": "Made the traditional way from milk of grass-fed cows in the Himalayan foothills."
    },
]

# Models
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

# Routes

@app.get("/")
def root():
    return {"message": "FoodPro API is running!", "version": "1.0.0"}

# GET all products
@app.get("/api/products")
def get_products():
    return {"status": "success", "data": products, "count": len(products)}

# GET single product
@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"status": "success", "data": product}

# POST create product
@app.post("/api/products", status_code=201)
def create_product(product: Product):
    new_product = product.dict()
    new_product["id"] = str(uuid.uuid4())
    products.append(new_product)
    return {"status": "success", "data": new_product}

# PUT update product
@app.put("/api/products/{product_id}")
def update_product(product_id: str, updated: UpdateProduct):
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = updated.dict(exclude_unset=True)
    product.update(update_data)
    return {"status": "success", "data": product}

# DELETE product
@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: str):
    global products
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    products = [p for p in products if p["id"] != product_id]
    return None

# SEARCH products
@app.get("/api/products/search/query")
def search_products(q: str):
    results = [
        p for p in products
        if q.lower() in p["name"].lower()
        or q.lower() in p["tone"].lower()
    ]
    return {"status": "success", "data": results, "count": len(results)}

# GET all tones
@app.get("/api/tones")
def get_tones():
    tones = ["Premium", "Traditional", "Health-Focused"]
    return {"status": "success", "data": tones}
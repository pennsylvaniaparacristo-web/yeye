from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# --- Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("inv")

# --- DB
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# --- Auth helpers
JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


# --- Models
class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    summary: str
    content: str
    image_url: Optional[str] = None
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NewsCreate(BaseModel):
    title: str
    summary: str
    content: str
    image_url: Optional[str] = None


class EventItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    location: str
    event_date: datetime
    image_url: Optional[str] = None
    featured: bool = False


class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    event_date: datetime
    image_url: Optional[str] = None
    featured: bool = False


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# --- App & Router
app = FastAPI(title="Iglesia Nueva Vida Internacional API")
api_router = APIRouter(prefix="/api")


# --- Dependencies
async def get_current_admin(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        return {"id": user["id"], "email": user["email"], "role": user.get("role", "admin")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


def serialize_doc(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop("_id", None)
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


# --- Routes: Health
@api_router.get("/")
async def root():
    return {"message": "Iglesia Nueva Vida Internacional API", "status": "ok"}


# --- Routes: Auth
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    token = create_access_token(user["id"], user["email"])
    return TokenResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "role": user.get("role", "admin")},
    )


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return current


# --- Routes: News (public read, admin write)
@api_router.get("/news", response_model=List[NewsItem])
async def list_news():
    docs = await db.news.find({}, {"_id": 0}).sort("published_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get("published_at"), str):
            d["published_at"] = datetime.fromisoformat(d["published_at"])
    return docs


@api_router.post("/news", response_model=NewsItem)
async def create_news(payload: NewsCreate, _: dict = Depends(get_current_admin)):
    item = NewsItem(**payload.model_dump())
    doc = item.model_dump()
    doc["published_at"] = doc["published_at"].isoformat()
    await db.news.insert_one(doc)
    return item


@api_router.put("/news/{news_id}", response_model=NewsItem)
async def update_news(news_id: str, payload: NewsCreate, _: dict = Depends(get_current_admin)):
    existing = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    update = payload.model_dump()
    await db.news.update_one({"id": news_id}, {"$set": update})
    existing.update(update)
    if isinstance(existing.get("published_at"), str):
        existing["published_at"] = datetime.fromisoformat(existing["published_at"])
    return existing


@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, _: dict = Depends(get_current_admin)):
    res = await db.news.delete_one({"id": news_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return {"ok": True}


# --- Routes: Events
@api_router.get("/events", response_model=List[EventItem])
async def list_events():
    docs = await db.events.find({}, {"_id": 0}).sort("event_date", 1).to_list(500)
    for d in docs:
        if isinstance(d.get("event_date"), str):
            d["event_date"] = datetime.fromisoformat(d["event_date"])
    return docs


@api_router.post("/events", response_model=EventItem)
async def create_event(payload: EventCreate, _: dict = Depends(get_current_admin)):
    item = EventItem(**payload.model_dump())
    doc = item.model_dump()
    doc["event_date"] = doc["event_date"].isoformat()
    await db.events.insert_one(doc)
    return item


@api_router.put("/events/{event_id}", response_model=EventItem)
async def update_event(event_id: str, payload: EventCreate, _: dict = Depends(get_current_admin)):
    existing = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    update = payload.model_dump()
    update["event_date"] = update["event_date"].isoformat() if isinstance(update["event_date"], datetime) else update["event_date"]
    await db.events.update_one({"id": event_id}, {"$set": update})
    existing.update(update)
    if isinstance(existing.get("event_date"), str):
        existing["event_date"] = datetime.fromisoformat(existing["event_date"])
    return existing


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, _: dict = Depends(get_current_admin)):
    res = await db.events.delete_one({"id": event_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return {"ok": True}


# --- Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Startup: seed admin + sample content
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@iglesianuevavida.org").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Administrador",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {admin_email}")
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )
            logger.info(f"Admin password updated: {admin_email}")

    # Seed sample news & events if collections empty
    if await db.news.count_documents({}) == 0:
        sample_news = [
            {
                "id": str(uuid.uuid4()),
                "title": "Servicio Dominical de Avivamiento",
                "summary": "Únete a nosotros este domingo en un servicio especial lleno del Espíritu Santo.",
                "content": "Te invitamos a nuestro servicio dominical de avivamiento donde experimentaremos la presencia de Dios a través de la alabanza, la palabra y la oración. Habrá ministración especial y un mensaje poderoso del Pastor.",
                "image_url": "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
                "published_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Nueva Escuela Bíblica Dominical",
                "summary": "Iniciamos un nuevo curso de discipulado para todas las edades.",
                "content": "A partir del próximo mes comenzamos un curso renovado de Escuela Bíblica Dominical con clases para niños, jóvenes, adultos y matrimonios. Inscripciones abiertas en la oficina de la iglesia.",
                "image_url": "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Bautismos en Aguas",
                "summary": "Celebramos nuevas vidas entregadas al Señor.",
                "content": "Este mes celebramos con gozo a 12 hermanos que dieron el paso del bautismo en aguas, declarando públicamente su fe en Cristo Jesús.",
                "image_url": "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
            },
        ]
        await db.news.insert_many(sample_news)
        logger.info("Sample news seeded")

    if await db.events.count_documents({}) == 0:
        future = datetime.now(timezone.utc) + timedelta(days=14)
        sample_events = [
            {
                "id": str(uuid.uuid4()),
                "title": "Gran Cruzada de Sanidad y Milagros",
                "description": "Una noche poderosa de adoración, predicación y ministración. Anunciada en el programa de radio 'Impacto de Dios al Pueblo'. ¡Trae a tu familia y amigos!",
                "location": "Iglesia Nueva Vida Internacional · Scranton, PA",
                "event_date": future.isoformat(),
                "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
                "featured": True,
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Vigilia de Oración",
                "description": "Noche de oración intensa por las familias, la ciudad y las naciones.",
                "location": "Templo Principal",
                "event_date": (datetime.now(timezone.utc) + timedelta(days=21)).isoformat(),
                "image_url": "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800",
                "featured": False,
            },
        ]
        await db.events.insert_many(sample_events)
        logger.info("Sample events seeded")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

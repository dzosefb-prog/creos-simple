from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Creos AI API", version="1.0.0")

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class ProductData(BaseModel):
    product_name: str
    core_problem: str
    primary_benefit: str
    visual_elements: str
    target_audience: str
    unique_mechanism: str
    emotional_benefit: str
    brand_personality: str
    headline: str

class IdeaRequest(BaseModel):
    product_data: ProductData
    num_ideas: int = 50

class ImageRequest(BaseModel):
    ideas: List[str]
    num_images: int = 30

# Инициализация OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.get("/")
async def root():
    return {"message": "Creos AI API работает!", "status": "success"}

@app.post("/generate-ideas")
async def generate_ideas(request: IdeaRequest):
    try:
        prompt = f"""
        Создай {request.num_ideas} креативных идей для рекламы продукта на основе данных:
        
        Название продукта: {request.product_data.product_name}
        Основная проблема: {request.product_data.core_problem}
        Главное преимущество: {request.product_data.primary_benefit}
        Визуальные элементы: {request.product_data.visual_elements}
        Целевая аудитория: {request.product_data.target_audience}
        Уникальный механизм: {request.product_data.unique_mechanism}
        Эмоциональная выгода: {request.product_data.emotional_benefit}
        Личность бренда: {request.product_data.brand_personality}
        Заголовок: {request.product_data.headline}
        
        Создай креативные, метафорические идеи для визуальной рекламы. Каждая идея должна быть уникальной и креативной.
        Верни только список идей, без дополнительного текста.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Ты креативный директор с 20-летним опытом в рекламе."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=4000
        )
        
        ideas_text = response.choices[0].message.content
        ideas = [idea.strip() for idea in ideas_text.split('\n') if idea.strip()]
        
        return {"ideas": ideas[:request.num_ideas], "status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка генерации идей: {str(e)}")

@app.post("/generate-images")
async def generate_images(request: ImageRequest):
    try:
        generated_images = []
        
        for i, idea in enumerate(request.ideas[:request.num_images]):
            try:
                response = openai.Image.create(
                    model="dall-e-3",
                    prompt=f"Создай рекламное изображение для креатива: {idea}. Стиль: профессиональная реклама, яркие цвета, метафорическая визуализация. Минимальный текст на изображении.",
                    size="1024x1024",
                    quality="standard",
                    n=1
                )
                
                image_url = response.data[0].url
                generated_images.append({
                    "id": i + 1,
                    "idea": idea,
                    "image_url": image_url,
                    "formats": {
                        "1:1": image_url,
                        "9:16": image_url,
                        "16:9": image_url
                    }
                })
                
            except Exception as e:
                print(f"Ошибка генерации изображения {i+1}: {str(e)}")
                continue
        
        return {"images": generated_images, "status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка генерации изображений: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
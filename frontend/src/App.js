import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [productData, setProductData] = useState({
    product_name: '',
    core_problem: '',
    primary_benefit: '',
    visual_elements: '',
    target_audience: '',
    unique_mechanism: '',
    emotional_benefit: '',
    brand_personality: '',
    headline: ''
  })
  const [ideas, setIdeas] = useState([])
  const [selectedIdeas, setSelectedIdeas] = useState([])
  const [images, setImages] = useState([])

  const handleInputChange = (field, value) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateIdeas = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-ideas`, {
        product_data: productData,
        num_ideas: 50
      })
      setIdeas(response.data.ideas)
      setStep(2)
    } catch (error) {
      alert('Ошибка при генерации идей: ' + error.message)
    }
    setLoading(false)
  }

  const toggleIdeaSelection = (idea) => {
    setSelectedIdeas(prev => 
      prev.includes(idea) 
        ? prev.filter(i => i !== idea)
        : [...prev, idea]
    )
  }

  const generateImages = async () => {
    if (selectedIdeas.length === 0) {
      alert('Выберите хотя бы одну идею!')
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-images`, {
        ideas: selectedIdeas,
        num_images: selectedIdeas.length
      })
      setImages(response.data.images)
      setStep(3)
    } catch (error) {
      alert('Ошибка при генерации изображений: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎨 Creos: AI Product Image Generator</h1>
        <p>Создавайте креативы для рекламы за минуты</p>
      </header>

      <div className="container">
        {step === 1 && (
          <div className="step">
            <h2>📝 Описание продукта</h2>
            <div className="form">
              {Object.keys(productData).map(field => (
                <div key={field} className="input-group">
                  <label>
                    {field.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}:
                  </label>
                  <input
                    type="text"
                    value={productData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Введите ${field.replace('_', ' ')}...`}
                  />
                </div>
              ))}
              <button 
                onClick={generateIdeas} 
                disabled={loading}
                className="generate-btn"
              >
                {loading ? 'Генерация...' : 'Generate Creative Briefs →'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h2>💡 Выберите идеи для генерации ({selectedIdeas.length} выбрано)</h2>
            <div className="ideas-grid">
              {ideas.map((idea, index) => (
                <div 
                  key={index} 
                  className={`idea-card ${selectedIdeas.includes(idea) ? 'selected' : ''}`}
                  onClick={() => toggleIdeaSelection(idea)}
                >
                  <div className="idea-content">
                    {idea}
                  </div>
                  <div className="idea-checkbox">
                    {selectedIdeas.includes(idea) ? '✓' : '+'}
                  </div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button onClick={() => setStep(1)} className="back-btn">
                ← Назад
              </button>
              <button 
                onClick={generateImages} 
                disabled={loading || selectedIdeas.length === 0}
                className="generate-btn"
              >
                {loading ? 'Генерация изображений...' : `Generate Images (${selectedIdeas.length}) →`}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <h2>🖼️ Готовые изображения ({images.length})</h2>
            <div className="images-grid">
              {images.map((image, index) => (
                <div key={index} className="image-card">
                  <div className="image-container">
                    <img src={image.image_url} alt={image.idea} />
                  </div>
                  <div className="image-info">
                    <p>{image.idea}</p>
                    <div className="formats">
                      <span>1:1</span>
                      <span>9:16</span>
                      <span>16:9</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button onClick={() => setStep(2)} className="back-btn">
                ← Сгенерировать еще
              </button>
              <button onClick={() => setStep(1)} className="generate-btn">
                🎨 Новый продукт
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'https://creos-simple.onrender.com'

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
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')

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

  const selectAllIdeas = () => {
    setSelectedIdeas(ideas)
  }

  const deselectAllIdeas = () => {
    setSelectedIdeas([])
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
        num_images: Math.min(selectedIdeas.length, 30)
      })
      setImages(response.data.images)
      setStep(3)
    } catch (error) {
      alert('Ошибка при генерации изображений: ' + error.message)
    }
    setLoading(false)
  }

  // Компонент прогресс-бара
  const ProgressSteps = ({ currentStep }) => (
    <div className="progress-steps">
      {[
        { number: 1, label: 'Описание продукта' },
        { number: 2, label: 'Выбор идей' },
        { number: 3, label: 'Готовые креативы' }
      ].map(step => (
        <div key={step.number} className="progress-step">
          <div className={`step-number ${step.number === currentStep ? 'active' : ''}`}>
            {step.number}
          </div>
          <div className={`step-label ${step.number === currentStep ? 'active' : ''}`}>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  )
  
  const CategoryPlatformSelector = () => (
  <div className="category-platform-section">
    <h3>🎯 Настройки генерации</h3>
    
    <div className="selector-grid">
      <div className="input-group">
        <label>Категория бизнеса *</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Выберите категорию</option>
          <option value="ecommerce">🛒 Интернет-магазин</option>
          <option value="mobile_apps">📱 Мобильное приложение</option>
          <option value="edtech">🎓 Образовательный проект</option>
          <option value="services">💼 Услуги</option>
          <option value="infobusiness">📈 Инфобизнес</option>
        </select>
      </div>

      <div className="input-group">
        <label>Рекламная платформа *</label>
        <select 
          value={selectedPlatform} 
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="platform-select"
        >
          <option value="">Выберите платформу</option>
          <option value="vk_ads">VK Реклама (текст {'<20%'})</option>
          <option value="meta_ads">Meta (Facebook/Instagram)</option>
          <option value="google_ads">Google Реклама</option>
          <option value="yandex_direct">Яндекс.Директ</option>
        </select>
      </div>
    </div>
  </div>
)

  return (
    <div className="app">
      {/* Хедер */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">C</div>
            Creos
          </div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Возможности</a>
            <a href="#pricing" className="nav-link">Тарифы</a>
            <a href="#about" className="nav-link">О нас</a>
            <button className="cta-button">Начать бесплатно</button>
          </nav>
        </div>
      </header>

      {/* Герой-секция */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI генератор креативов для рекламы</h1>
          <p>Создавайте продающие изображения для Meta, Google, VK и Яндекс.Директ с помощью искусственного интеллекта</p>
        </div>
      </section>

      <div className="container">
        <ProgressSteps currentStep={step} />

        {step === 1 && (
          <div className="step">
            <h2>
              <div className="step-icon">📝</div>
              Описание вашего продукта
            </h2>
            <CategoryPlatformSelector />
            <div className="form">
              {[
                { key: 'product_name', label: 'Название продукта', placeholder: 'Введите название вашего продукта или услуги...' },
                { key: 'core_problem', label: 'Основная проблема', placeholder: 'Какую проблему решает ваш продукт?' },
                { key: 'primary_benefit', label: 'Главное преимущество', placeholder: 'Основное преимущество для клиента...' },
                { key: 'visual_elements', label: 'Визуальные элементы', placeholder: 'Ключевые цвета, стиль, элементы бренда...' },
                { key: 'target_audience', label: 'Целевая аудитория', placeholder: 'Кто ваши идеальные клиенты?' },
                { key: 'unique_mechanism', label: 'Уникальное предложение', placeholder: 'Что делает ваш продукт особенным?' },
                { key: 'emotional_benefit', label: 'Эмоциональная выгода', placeholder: 'Какие эмоции вызывает продукт?' },
                { key: 'brand_personality', label: 'Личность бренда', placeholder: 'Стиль общения, ценности бренда...' },
                { key: 'headline', label: 'Заголовок', placeholder: 'Основной заголовок для рекламы...' }
              ].map(field => (
                <div key={field.key} className="input-group">
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={productData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              
              <button 
                onClick={generateIdeas} 
                disabled={loading || !productData.product_name.trim()}
                className="generate-btn"
              >
                {loading ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Генерация идей...
                  </>
                ) : (
                  <>
                    Сгенерировать идеи →
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h2>
              <div className="step-icon">💡</div>
              Выберите идеи для генерации
              <span style={{fontSize: '1rem', color: 'var(--gray-600)', marginLeft: '1rem'}}>
                ({selectedIdeas.length} из {ideas.length} выбрано)
              </span>
            </h2>

            <div className="actions" style={{justifyContent: 'flex-start', marginBottom: '2rem'}}>
              <button onClick={selectAllIdeas} className="back-btn" style={{background: 'var(--secondary)'}}>
                Выбрать все
              </button>
              <button onClick={deselectAllIdeas} className="back-btn" style={{background: 'var(--gray-500)'}}>
                Сбросить
              </button>
            </div>

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
                    {selectedIdeas.includes(idea) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div className="actions">
              <button onClick={() => setStep(1)} className="back-btn">
                ← Назад к описанию
              </button>
              <button 
                onClick={generateImages} 
                disabled={loading || selectedIdeas.length === 0}
                className="generate-btn"
              >
                {loading ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Генерация изображений...
                  </>
                ) : (
                  `Создать ${selectedIdeas.length} изображений →`
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step">
            <h2>
              <div className="step-icon">🎨</div>
              Готовые рекламные креативы
              <span style={{fontSize: '1rem', color: 'var(--gray-600)', marginLeft: '1rem'}}>
                ({images.length} изображений)
              </span>
            </h2>

            {images.length > 0 && (
              <div className="success-message">
                ✅ Успешно сгенерировано {images.length} креативов
              </div>
            )}

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
              <button onClick={() => {
                setStep(1)
                setProductData({
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
                setIdeas([])
                setSelectedIdeas([])
                setImages([])
              }} className="generate-btn">
                🚀 Новый продукт
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Футер */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Creos. AI генератор креативов для рекламы</p>
          <p>Создано с помощью искусственного интеллекта</p>
        </div>
      </footer>
    </div>
  )
}

export default App

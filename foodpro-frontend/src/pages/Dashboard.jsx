import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/ui/Loader'
import Toast from '../components/ui/Toast'

function Dashboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [selectedTone, setSelectedTone] = useState('Premium')
  const [form, setForm] = useState({
    name: '', ingredients: '', weight: '', features: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    fetch('http://127.0.0.1:8000/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
          throw new Error('Unauthorized')
        }
        return res.json()
      })
      .then(data => {
        setProducts(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [navigate])

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Product name is required'
    if (!form.ingredients.trim()) errors.ingredients = 'Ingredients are required'
    if (!form.weight.trim()) errors.weight = 'Weight/size is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGenerateDescription = () => {
    if (!validateForm()) return
    setAiLoading(true)
    setGeneratedDescription('')
    const token = localStorage.getItem('token')

    fetch('http://127.0.0.1:8000/api/ai/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, tone: selectedTone })
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.detail || 'AI generation failed')
        }
        return data
      })
      .then(data => {
        setGeneratedDescription(data.data.description)
        setAiLoading(false)
      })
      .catch(err => {
        setToastMessage(err.message || 'Failed to generate description. Please try again.')
        setToastType('error')
        setToastVisible(true)
        setAiLoading(false)
      })
  }

  const handleGenerate = () => {
    if (!validateForm()) return
    setSaving(true)
    const isEditing = editingId !== null
    const url = isEditing
      ? `http://127.0.0.1:8000/api/products/${editingId}`
      : 'http://127.0.0.1:8000/api/products'
    const method = isEditing ? 'PUT' : 'POST'
    const token = localStorage.getItem('token')

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, tone: selectedTone, description: generatedDescription })
    })
      .then(res => res.json())
      .then(data => {
        if (isEditing) {
          setProducts(prev => prev.map(p => p.id === editingId ? data.data : p))
          setToastMessage('Product updated successfully!')
        } else {
          setProducts(prev => [...prev, data.data])
          setToastMessage('Product created successfully!')
        }
        setToastType('success')
        setToastVisible(true)
        setSaving(false)
        setForm({ name: '', ingredients: '', weight: '', features: '' })
        setFormErrors({})
        setGeneratedDescription('')
        setEditingId(null)
      })
      .catch(() => {
        setToastMessage(isEditing ? 'Failed to update product' : 'Failed to create product')
        setToastType('error')
        setToastVisible(true)
        setSaving(false)
      })
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      ingredients: product.ingredients,
      weight: product.weight,
      features: product.features
    })
    setFormErrors({})
    setSelectedTone(product.tone)
    setGeneratedDescription(product.description || '')
    setEditingId(product.id)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return
    const token = localStorage.getItem('token')
    fetch(`http://127.0.0.1:8000/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id))
        setToastMessage('Product deleted successfully!')
        setToastType('success')
        setToastVisible(true)
      })
      .catch(() => {
        setToastMessage('Failed to delete product')
        setToastType('error')
        setToastVisible(true)
      })
  }

  return (
    <div className={darkMode ? 'bg-gray-950 min-h-screen' : 'bg-gray-50 min-h-screen'}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <section className="px-5 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`font-bold text-3xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Generate Description
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Fill in your product details and let AI do the writing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h2 className={`font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Himalayan Wildflower Honey"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${formErrors.name ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Key Ingredients</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure wild honey"
                    value={form.ingredients}
                    onChange={e => setForm({...form, ingredients: e.target.value})}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${formErrors.ingredients ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {formErrors.ingredients && <p className="text-xs text-red-500 mt-1">{formErrors.ingredients}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Weight / Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 500g"
                    value={form.weight}
                    onChange={e => setForm({...form, weight: e.target.value})}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${formErrors.weight ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {formErrors.weight && <p className="text-xs text-red-500 mt-1">{formErrors.weight}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Key Features</label>
                  <textarea
                    placeholder="e.g. Raw, unprocessed, forest-sourced"
                    rows="3"
                    value={form.features}
                    onChange={e => setForm({...form, features: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tone</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Premium', 'Traditional', 'Health-Focused'].map(tone => (
                      <button
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                          selectedTone === tone
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateDescription}
                  disabled={aiLoading}
                  className="bg-blue-600 text-white w-full font-semibold py-3.5 rounded-xl text-base hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {aiLoading ? 'Generating...' : '✨ Generate with AI'}
                </button>

                {aiLoading && (
                  <div className="flex justify-center py-4">
                    <Loader size="sm" text="AI is writing..." />
                  </div>
                )}

                {generatedDescription && !aiLoading && (
                  <div className={`p-4 rounded-xl border transition-opacity duration-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-green-50 border-green-200 text-gray-800'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Generated Description</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedDescription)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="text-xs font-medium text-green-600 hover:text-green-700"
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-sm">{generatedDescription}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={saving}
                  className="bg-green-600 text-white w-full font-semibold py-3.5 rounded-xl text-base hover:bg-green-700 transition mt-2 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </div>

            <div className={`rounded-2xl border shadow-sm p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h2 className={`font-semibold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Products from Backend
              </h2>
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader size="md" text="Loading from API..." />
                </div>
              ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-4xl mb-3">📦</div>
                  <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    No products yet
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Fill out the form and generate your first description
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {products.map(product => (
                    <div key={product.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {product.name}
                        </h3>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          {product.tone}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {product.weight} • {product.ingredients}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <Footer />
    </div>
  )
}

export default Dashboard
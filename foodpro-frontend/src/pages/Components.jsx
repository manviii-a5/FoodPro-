import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import Loader from '../components/ui/Loader'
import { useState } from 'react'

function Components({ darkMode, setDarkMode}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState('success')

  const showToast = (type) => {
    setToastType(type)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  return (
    <div>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <section className="max-w-4xl mx-auto px-5 py-16">

        <div className="text-center mb-12">
          <h1 className="font-bold text-4xl text-gray-900 mb-3">
            Component Library
          </h1>
          <p className="text-gray-500">
            All reusable UI components built for FoodPro
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Button</h2>
          <p className="text-gray-500 text-sm mb-5">3 variants and 3 sizes</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="outline" size="md">Outline</Button>
            <Button variant="primary" size="md" disabled>Disabled</Button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Input</h2>
          <p className="text-gray-500 text-sm mb-5">Supports label and error state</p>
          <div className="flex flex-col gap-4 max-w-sm">
            <Input label="Product Name" placeholder="e.g. Himalayan Honey" />
            <Input label="Email" type="email" placeholder="you@himshakti.in" />
            <Input label="Password" type="password" placeholder="Enter password" error="Password is required" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Modal</h2>
          <p className="text-gray-500 text-sm mb-5">Opens a centered popup</p>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="FoodPro Modal">
            This is a reusable modal component for confirmations and alerts.
          </Modal>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Toast</h2>
          <p className="text-gray-500 text-sm mb-5">Auto hides after 3 seconds</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => showToast('success')}>Success</Button>
            <Button variant="outline" onClick={() => showToast('error')}>Error</Button>
            <Button variant="secondary" onClick={() => showToast('warning')}>Warning</Button>
          </div>
          <Toast
            message="Description generated successfully!"
            type={toastType}
            isVisible={toastVisible}
            onClose={() => setToastVisible(false)}
          />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-xl text-gray-900 mb-2">Loader</h2>
          <p className="text-gray-500 text-sm mb-5">3 sizes available</p>
          <div className="flex flex-wrap gap-10 items-center">
            <Loader size="sm" text="Small" />
            <Loader size="md" text="Medium" />
            <Loader size="lg" text="Large" />
          </div>
        </div>

      </section>
      <Footer />
    </div>
  )
}

export default Components
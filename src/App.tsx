/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ShoppingBag, UtensilsCrossed, ChevronRight, X, Scan, QrCode, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const MENU_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Soft Idly (2 pcs)',
    price: 45,
    description: 'Steamed rice cakes served with sambar and two types of chutney.',
    image: 'https://picsum.photos/seed/idly/400/300',
    category: 'Breakfast'
  },
  {
    id: '2',
    name: 'Crispy Ghee Dosa',
    price: 85,
    description: 'Golden thin crepe roasted with pure ghee, served with spicy chutneys.',
    image: 'https://picsum.photos/seed/dosa/400/300',
    category: 'Breakfast'
  },
  {
    id: '3',
    name: 'Poori Masala (3 pcs)',
    price: 75,
    description: 'Fluffy deep-fried wheat bread served with potato masala.',
    image: 'https://picsum.photos/seed/poori/400/300',
    category: 'Breakfast'
  },
  {
    id: '4',
    name: 'South Indian Meals',
    price: 150,
    description: 'Traditional thali with rice, sambar, rasam, kootu, poriyal, and curd.',
    image: 'https://picsum.photos/seed/meals/400/300',
    category: 'Lunch'
  },
  {
    id: '5',
    name: 'Malabar Parotta (2 pcs)',
    price: 60,
    description: 'Layered flaky flatbread served with vegetable kurma.',
    image: 'https://picsum.photos/seed/parotta/400/300',
    category: 'Lunch'
  }
];

const GST_RATE = 0.18;

type AppStep = 'qr' | 'scanning' | 'menu';

export default function App() {
  const [step, setStep] = useState<AppStep>('qr');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);

  // Simulate scanning process
  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => {
        setStep('menu');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const totals = useMemo(() => {
    const subtotal = MENU_ITEMS.reduce((acc, item) => {
      return acc + (item.price * (cart[item.id] || 0));
    }, 0);
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;
    const itemCount = Object.values(cart).reduce((a: number, b: number) => a + b, 0);
    
    return { subtotal, gst, total, itemCount };
  }, [cart]);

  // QR Code Landing Page
  if (step === 'qr') {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-8 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-[#5A5A40] text-white w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#5A5A40]/20">
            <UtensilsCrossed size={32} />
          </div>
          
          <h1 className="text-4xl font-serif font-bold mb-4">Welcome to QuickBite</h1>
          <p className="text-[#666] mb-12 leading-relaxed">
            Scan the QR code on your table to browse our menu and place your order instantly.
          </p>

          <div className="relative group mx-auto w-fit">
            <div className="absolute -inset-4 bg-[#5A5A40]/5 rounded-[40px] blur-xl group-hover:bg-[#5A5A40]/10 transition-all duration-500"></div>
            <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-[#F5F5F0]">
              <QRCodeSVG 
                value={window.location.href} 
                size={200}
                fgColor="#1A1A1A"
                level="H"
                includeMargin={false}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-sm rounded-[40px]">
                <QrCode size={48} className="text-[#5A5A40]" />
              </div>
            </div>
          </div>

          <p className="mt-12 text-xs uppercase tracking-[0.3em] text-[#999] font-bold mb-12">Table No. 12</p>

          <button 
            onClick={() => setStep('scanning')}
            className="group w-full bg-[#1A1A1A] text-white py-6 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#333] transition-all shadow-2xl shadow-black/10 active:scale-95"
          >
            <Scan size={20} />
            Scan to Order
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Simulated Scanning Step
  if (step === 'scanning') {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative w-72 h-72 border-2 border-white/20 rounded-[40px] flex items-center justify-center">
          <motion.div 
            initial={{ y: -140 }}
            animate={{ y: 140 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              repeatType: 'reverse',
              ease: "easeInOut"
            }}
            className="absolute w-full h-1 bg-[#5A5A40] shadow-[0_0_20px_#5A5A40] z-10"
          />
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#5A5A40] rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#5A5A40] rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#5A5A40] rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#5A5A40] rounded-br-3xl"></div>
          
          <QrCode size={120} className="text-white/10" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <p className="text-white font-mono tracking-[0.3em] uppercase text-sm mb-2">Authenticating</p>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                className="w-1.5 h-1.5 bg-[#5A5A40] rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5] px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif italic font-bold tracking-tight">QuickBite</h1>
            <p className="text-[10px] text-[#666] uppercase tracking-widest font-medium">Table No. 12</p>
          </div>
          <div className="bg-[#5A5A40] text-white p-2 rounded-full shadow-lg shadow-[#5A5A40]/20">
            <UtensilsCrossed size={20} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h2 className="text-4xl font-serif font-light mb-3">Our Menu</h2>
          <div className="h-1 w-16 bg-[#5A5A40] rounded-full"></div>
        </div>

        <div className="space-y-10">
          {MENU_ITEMS.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex gap-5 items-start"
            >
              <div className="relative w-28 h-28 flex-shrink-0 rounded-3xl overflow-hidden shadow-md">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow pt-1">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-xl font-medium tracking-tight">{item.name}</h3>
                  <span className="font-mono text-base font-bold text-[#5A5A40]">₹{item.price}</span>
                </div>
                <p className="text-sm text-[#666] line-clamp-2 mb-4 leading-relaxed font-light">
                  {item.description}
                </p>
                
                <div className="flex justify-end">
                  {cart[item.id] ? (
                    <div className="flex items-center bg-[#F5F5F0] rounded-2xl p-1 border border-[#E5E5E5] shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-all active:scale-90"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-mono font-bold text-base">
                        {cart[item.id]}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-all active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-6 py-2 bg-white border-2 border-[#5A5A40] text-[#5A5A40] rounded-2xl text-sm font-bold hover:bg-[#5A5A40] hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Cart Summary Bar */}
      <AnimatePresence>
        {totals.itemCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-6 right-6 z-20"
          >
            <div className="max-w-2xl mx-auto bg-[#1A1A1A] text-white rounded-[32px] p-5 shadow-2xl flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-5 pl-3">
                <div className="relative">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <ShoppingBag size={24} />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-[#5A5A40] text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#1A1A1A]">
                    {totals.itemCount}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">Total with GST</p>
                  <p className="text-xl font-mono font-bold tracking-tight">₹{totals.total.toFixed(2)}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowCheckout(true)}
                className="bg-white text-[#1A1A1A] px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 hover:bg-[#F5F5F0] transition-all active:scale-95 shadow-lg"
              >
                View Order
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-30"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[48px] z-40 p-10 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="max-w-2xl mx-auto relative">
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="absolute -top-4 -right-4 p-2 bg-[#F5F5F0] rounded-full text-[#666] hover:text-[#1A1A1A] transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-16 h-1.5 bg-[#E5E5E5] rounded-full mx-auto mb-10"></div>
                
                <div className="mb-10">
                  <h2 className="text-3xl font-serif font-bold mb-2">Order Summary</h2>
                  <p className="text-sm text-[#666]">Review your items before placing the order</p>
                </div>
                
                <div className="space-y-6 mb-10">
                  {MENU_ITEMS.filter(item => cart[item.id]).map(item => (
                    <div key={item.id} className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F5F5F0]">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-xs text-[#666] font-mono">₹{item.price} × {cart[item.id]}</p>
                        </div>
                      </div>
                      <p className="font-mono font-bold text-lg">₹{item.price * cart[item.id]}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 bg-[#FDFCFB] p-8 rounded-[32px] border border-[#F5F5F0] shadow-sm">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666] font-medium">Subtotal</span>
                    <span className="font-mono font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666] font-medium">GST (18%)</span>
                    <span className="font-mono font-semibold">₹{totals.gst.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-[#E5E5E5] my-2"></div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-[#666] uppercase tracking-widest font-bold mb-1">Grand Total</p>
                      <p className="text-3xl font-mono font-black text-[#1A1A1A]">₹{totals.total.toFixed(2)}</p>
                    </div>
                    <div className="text-[10px] text-[#666] italic">Inclusive of all taxes</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    alert('Order placed successfully! Your food is being prepared.');
                    setCart({});
                    setShowCheckout(false);
                  }}
                  className="w-full bg-[#5A5A40] text-white py-6 rounded-[24px] font-bold text-xl mt-10 shadow-2xl shadow-[#5A5A40]/30 hover:scale-[1.01] active:scale-[0.98] transition-all"
                >
                  Confirm & Place Order
                </button>
                
                <p className="text-center text-[11px] text-[#999] mt-6 uppercase tracking-widest font-bold">
                  QuickBite Digital Menu System
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

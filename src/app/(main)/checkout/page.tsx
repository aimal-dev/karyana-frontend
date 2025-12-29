"use client"

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, CreditCard, Wallet, Building2, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "CASH_ON_DELIVERY";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const syncCart = useCartStore((state) => state.syncCart);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    phone: "",
  });
  const [saveToProfile, setSaveToProfile] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch user profile to verify authentication
        const res = await api.get("/auth/me");
        if (res.data?.user) {
          const { address, city, phone } = res.data.user;
          setFormData((prev) => ({
            ...prev,
            address: address || "",
            city: city || "",
            phone: phone || "",
          }));
        }
        
        // Sync local cart items to backend so checkout can see them
        await syncCart();
        
        setIsCheckingAuth(false);
      } catch (error: unknown) {
        // Only redirect on 401 (Unauthorized)
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 401) {
          router.push("/login?redirect=/checkout");
        } else {
          // If it's another error (like 404 or 500), just let it pass or log it
          // We can set isCheckingAuth to false to let the page render (likely will fail later if actually auth required)
           console.error("Auth verification failed:", error);
           setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Redirect if cart is empty
  if (items.length === 0 && !success) {
    router.push("/cart");
    return null;
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="size-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium text-sm uppercase tracking-widest">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "CREDIT_CARD" as PaymentMethod,
      name: "Credit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
    },
    {
      id: "DEBIT_CARD" as PaymentMethod,
      name: "Debit Card",
      icon: CreditCard,
      description: "Direct bank payment",
    },
    {
      id: "PAYPAL" as PaymentMethod,
      name: "PayPal",
      icon: Wallet,
      description: "Fast & secure",
    },
    {
      id: "CASH_ON_DELIVERY" as PaymentMethod,
      name: "Cash on Delivery",
      icon: Building2,
      description: "Pay when you receive",
    },
  ];

  const handleCheckout = async () => {
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }

    if (!formData.address || !formData.city || !formData.phone) {
        setError("Please provide all shipping details (Address, City, Phone)");
        return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Force sync local cart to backend before checkout
      // This ensures backend DB has the items
      await syncCart();

      if (saveToProfile) {
        try {
          await api.put("/auth/profile", formData);
        } catch (err) {
          console.error("Failed to update profile address", err);
          // Don't block checkout if profile update fails, but maybe warn? 
          // Ignoring for now to keep flow smooth.
        }
      }

      const response = await api.post("/orders/checkout", {
        method: selectedMethod,
        ...formData
      });

      if (response.data) {
        setSuccess(true);
        clearCart();
        
        // Redirect to order confirmation after 2 seconds
        setTimeout(() => {
          router.push(`/orders/${response.data.order.id}`);
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Failed to process checkout. Please try again.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="size-32 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center mb-8 animate-pulse">
          <CheckCircle2 className="size-16 text-primary" />
        </div>
        <h2 className="text-4xl font-medium tracking-tighter mb-2 uppercase font-subheading-main text-center">
          ORDER PLACED <span className="text-primary">SUCCESSFULLY!</span>
        </h2>
        <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest mb-8 text-center max-w-md opacity-70 font-subheading">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <div className="flex gap-4">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="h-12 px-10 gap-3 font-medium tracking-[0.2em] text-[10px] rounded-xl uppercase">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="gap-2 font-medium text-[9px] tracking-[0.2em] uppercase">
                <ArrowLeft className="size-3.5" /> BACK TO CART
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Payment Method Selection */}
            <div className="flex-1 space-y-8">
              <div className="border-b border-border pb-6 font-subheading-main">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase font-subheading-main">
                  SECURE <span className="text-primary font-subheading-main">CHECKOUT</span>
                </h1>
                <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest mt-2 font-subheading">
                  Select your preferred payment method
                </p>
              </div>

              {/* Shipping Form */}
              <div className="space-y-6">
                 <h2 className="text-xl font-medium uppercase tracking-tighter font-subheading-main">
                    Shipping <span className="text-primary">Details</span>
                 </h2>
                 <div className="grid gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</label>
                       <Input 
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                         placeholder="House No, Street, Area"
                         className="bg-muted/30 border-border h-12 rounded-xl"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                           <Input 
                             value={formData.city}
                             onChange={(e) => setFormData({...formData, city: e.target.value})}
                             placeholder="City Name"
                             className="bg-muted/30 border-border h-12 rounded-xl"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</label>
                           <Input 
                             value={formData.phone}
                             onChange={(e) => setFormData({...formData, phone: e.target.value})}
                             placeholder="0300-1234567"
                             className="bg-muted/30 border-border h-12 rounded-xl"
                           />
                        </div>
                    </div>
                 </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="saveToProfile"
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="saveToProfile" className="text-sm font-medium text-muted-foreground cursor-pointer uppercase tracking-wider">
                      Save as my default shipping address
                    </label>
                  </div>

              </div>
              
              <div className="h-px bg-border my-6" />

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
                  <p className="text-destructive font-medium text-sm uppercase tracking-wider">
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full bg-card border-2 rounded-3xl p-6 flex items-center gap-6 transition-all hover:shadow-xl ${
                        isSelected
                          ? "border-primary shadow-lg shadow-primary/20"
                          : "border-border hover:border-primary/20"
                      }`}
                    >
                      <div
                        className={`size-16 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted/30"
                        }`}
                      >
                        <Icon className="size-7" />
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-lg uppercase font-subheading-main">
                          {method.name}
                        </h3>
                        <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest font-subheading">
                          {method.description}
                        </p>
                      </div>

                      <div
                        className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}
                      >
                        {isSelected && <div className="size-3 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Security Badge */}
              <div className="bg-muted/30 border border-border rounded-2xl p-6 flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg
                    className="size-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm uppercase tracking-wider font-subheading-main">
                    Secure Payment
                  </p>
                  <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest font-subheading">
                    Your payment information is encrypted & secure
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="w-full lg:w-96 shrink-0">
              <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-8 sticky top-32 shadow-sm">
                <div className="space-y-4 font-subheading-main">
                  <h2 className="font-medium text-3xl uppercase tracking-tighter leading-none font-subheading-main">
                    ORDER <span className="text-primary">SUMMARY</span>
                  </h2>
                  <div className="w-8 h-1 bg-primary" />
                </div>

                {/* Items List */}
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 pb-4 border-b border-border/50"
                    >
                      <div className="size-16 rounded-xl bg-muted/30 border border-border relative overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover p-1"
                          />
                        ) : (
                          <div className="text-muted-foreground">
                            <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm uppercase truncate font-subheading-main">{item.title}</h4>
                        <p className="text-muted-foreground font-medium text-[14px] uppercase tracking-widest font-subheading">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <p className="font-medium text-sm tracking-tighter">
                        Rs {(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center font-medium text-[14px] tracking-widest uppercase font-subheading">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium tracking-tighter text-lg">
                      Rs {totalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-medium text-[14px] tracking-widest uppercase text-primary font-subheading">
                    <span>Delivery Fee</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between items-center font-medium text-[14px] tracking-widest uppercase font-subheading">
                    <span className="text-muted-foreground">Est. Taxes</span>
                    <span className="font-medium tracking-tighter text-lg">Rs 0.00</span>
                  </div>

                  <div className="border-t border-border pt-6 flex justify-between items-end font-subheading-main">
                    <span className="font-medium text-2xl uppercase tracking-tighter">
                      Total Price
                    </span>
                    <div className="text-right">
                      <span className="block text-primary font-medium text-4xl tracking-tighter leading-none">
                        Rs {totalPrice().toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-[8px] font-medium uppercase tracking-[0.2em] italic font-subheading">
                        Includes all taxes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={!selectedMethod || isProcessing}
                  className="w-full h-14 text-[10px] font-medium tracking-[0.3em] rounded-2xl gap-3 shadow-lg shadow-primary/20 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      PLACE ORDER
                      <CheckCircle2 className="size-4" />
                    </>
                  )}
                </Button>

                {/* Payment Icons */}
                <div className="flex flex-col items-center gap-4 text-center pt-4">
                  <p className="text-[8px] font-medium tracking-[0.2em] text-muted-foreground uppercase font-subheading">
                    Accepted Secure Payments
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                      <span className="text-[10px] font-medium tracking-wider text-muted-foreground">PAYPAL</span>
                    </div>
                    <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                      <span className="text-[10px] font-medium tracking-wider text-muted-foreground">VISA</span>
                    </div>
                    <div className="px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                      <span className="text-[10px] font-medium tracking-wider text-muted-foreground">MASTERCARD</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

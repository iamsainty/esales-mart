"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export default function Checkout(): JSX.Element {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<number | undefined>(undefined);
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<number | undefined>(undefined);
  const [cardNumber, setCardNumber] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [cvv, setCvv] = useState<number | undefined>(undefined);

  const [quantity, setQuantity] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `https://dummyjson.com/products/${productId}`
      );
      const data = await response.json();
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  if (!product)
    return (
      <div className="text-center py-20 text-lg font-medium">Loading...</div>
    );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePlaceOrder = async () => {
    try {
      if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !state ||
        !zip ||
        !cardNumber ||
        !expiryDate ||
        !cvv
      ) {
        toast.error("Please fill in all fields");
        return;
      }

      if (!validateEmail(email)) {
        toast.error("Invalid email address");
        return;
      }

      if (phone.toString().length !== 10) {
        toast.error("Enter a valid 10 digit phone number");
        return;
      }

      if (quantity > product.stock) {
        toast.error("Quantity is not available");
        return;
      }

      if (cardNumber.toString().length !== 16) {
        toast.error("Enter a valid card 16 digit number");
        return;
      }

      if (cvv.toString().length !== 3) {
        toast.error("Enter a valid 3 digit CVV number");
        return;
      }

      if (expiryDate < new Date()) {
        toast.error("Enter a valid expiry date");
        return;
      }

      const response = await fetch("/api/sendOrderEmail", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          product,
          quantity,
          totalPrice: product.price * quantity,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to send email");
        return;
      }

      localStorage.setItem("name", name);
      localStorage.setItem("purchaseSuccess", "true");
      localStorage.setItem("productId", product.id.toString());
      localStorage.setItem("quantity", quantity.toString());
      localStorage.setItem("totalPrice", (product.price * quantity).toString());

      router.push("/thank-you");

      toast.success("Order placed successfully");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
      {/* Title */}
      <div className="my-20">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground text-sm">
          Complete your purchase below
        </p>
      </div>

      {/* Order Summary */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-full md:w-80 h-72 rounded-none overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl font-semibold">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium">In stock:</span>{" "}
                {product.stock > 0 ? "Available" : "Not available"}
              </p>
            </div>
            <div className="text-lg font-semibold">
              ${product.price}
              <span className="text-sm text-muted-foreground line-through ml-2 font-normal">
                $
                {(
                  product.price /
                  (1 - product.discountPercentage / 100)
                ).toFixed(2)}
              </span>
            </div>
            <p className="text-sm flex items-center gap-1 text-muted-foreground">
              <Star className="w-4 h-4" /> {product.rating} / 5
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-muted px-2 py-1 text-xs rounded-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shipping & Payment */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Shipping & Payment Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Phone Number"
            value={phone}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setPhone(Number(e.target.value))}
          />
          <Input
            type="text"
            placeholder="Address"
            value={address}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            type="text"
            placeholder="City"
            value={city}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            type="text"
            placeholder="State"
            value={state}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setState(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Zip Code"
            value={zip}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setZip(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2 pt-6 max-w-md">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <p className="text-sm text-muted-foreground">
            Enter your card details below
          </p>
          <Input
            type="number"
            placeholder="Card Number"
            value={cardNumber}
            className="rounded-none focus-visible:ring-0"
            onChange={(e) => setCardNumber(Number(e.target.value))}
          />
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Expiry Date"
              value={expiryDate ? expiryDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setExpiryDate(new Date(e.target.value))}
              className="rounded-none focus-visible:ring-0"
            />
            <Input
              type="number"
              placeholder="CVV"
              value={cvv}
              className="rounded-none focus-visible:ring-0"
              onChange={(e) => setCvv(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-4 pt-6 max-w-md">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Amount Payable</h3>
            <p className="text-sm text-muted-foreground">
              Below is a description of the amount payable
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Quantity</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setQuantity(quantity - 1);
                }}
                disabled={quantity === 1}
                className="w-8 h-8"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 text-sm">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setQuantity(quantity + 1);
                }}
                disabled={quantity === product.stock}
                className="w-8 h-8"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total Amount */}
          <div className="pt-2 text-sm">
            <span className="font-medium">Total Amount:</span>{" "}
            <span className="text-base font-semibold">
              $ {(product.price * quantity).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-6 max-w-md">
          <Button
            className="w-full py-2.5 text-base rounded-none font-semibold"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </section>

      {/* Info + Reviews */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Product Info */}
        <div className="bg-muted p-5 rounded-none space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Shipping Information</h2>
            <p className="text-sm text-muted-foreground">
              {product.shippingInformation}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Warranty</h2>
            <p className="text-sm text-muted-foreground">
              {product.warrantyInformation}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Return Policy</h2>
            <p className="text-sm text-muted-foreground">
              {product.returnPolicy}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-muted p-5 rounded-none space-y-3">
          <h2 className="text-lg font-semibold">Customer Reviews</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="text-sm flex items-center gap-1">
                    <Star className="w-4 h-4" /> {review.rating}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {review.comment}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    — {review.reviewerName},{" "}
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No reviews available.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

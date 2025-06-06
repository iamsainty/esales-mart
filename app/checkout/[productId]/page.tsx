"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";
import { toast } from "sonner";
import { FiShoppingCart } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/Product";
import { RiLoader4Line } from "react-icons/ri";

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
  }, []);

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

  if (!product) {
    return (
      <div className="container mx-auto py-12 px-6 max-w-5xl space-y-10">
        {/* Back Button */}
        <div>
          <Skeleton className="w-32 h-8 rounded-none" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Order Summary */}
        <section className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="w-full md:w-80 h-72" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-4 w-72" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2 flex-wrap pt-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-12" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Shipping & Payment */}
        <section className="space-y-6">
          <Skeleton className="h-8 w-72" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>

          <div className="space-y-4 pt-6 max-w-md">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>

          <div className="space-y-4 pt-6 max-w-md">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />

            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-12 h-6" />
              <Skeleton className="w-8 h-8" />
            </div>

            <Skeleton className="h-5 w-40" />
          </div>

          <div className="pt-6 max-w-md">
            <Skeleton className="h-10 w-full" />
          </div>
        </section>

        {/* Info + Reviews */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-muted p-5 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full mt-1" />
              </div>
            ))}
          </div>
          <div className="bg-muted p-5 space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1 border-b pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
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
        setIsLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        toast.error("Invalid email address");
        setIsLoading(false);
        return;
      }

      if (phone.toString().length !== 10) {
        toast.error("Enter a valid 10 digit phone number");
        setIsLoading(false);
        return;
      }

      if (quantity > product.stock) {
        toast.error("Quantity is not available");
        setIsLoading(false);
        return;
      }

      if (cardNumber.toString().length !== 16) {
        toast.error("Enter a valid card 16 digit number");
        setIsLoading(false);
        return;
      }

      if (cvv.toString().length !== 3) {
        toast.error("Enter a valid 3 digit CVV number");
        setIsLoading(false);
        return;
      }

      if (expiryDate < new Date()) {
        toast.error("Enter a valid expiry date");
        setIsLoading(false);
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
        setIsLoading(false);
        return;
      }

      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      localStorage.setItem("phone", phone.toString());
      localStorage.setItem("address", address);
      localStorage.setItem("city", city);
      localStorage.setItem("state", state);
      localStorage.setItem("zip", zip.toString());
      localStorage.setItem("purchaseSuccess", "true");
      localStorage.setItem("productId", product.id.toString());
      localStorage.setItem("quantity", quantity.toString());
      localStorage.setItem("totalPrice", (product.price * quantity).toString());

      router.push("/thank-you");

      toast.success("Order placed successfully");
      setIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl space-y-10">
      <div>
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-black/50 rounded-none cursor-pointer px-3 py-1 text-sm"
          >
            ← Back to Home
          </Button>
        </Link>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground text-base">
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
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Select Quantity</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setQuantity(quantity - 1);
                }}
                disabled={quantity === 1}
                className="w-8 h-8 border border-black/50 rounded-none"
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
                className="w-8 h-8 border border-black/50 rounded-none"
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
            className="w-full py-2.5 text-base rounded-none font-semibold cursor-pointer flex items-center justify-center gap-2"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? (
              <RiLoader4Line className="w-4 h-4 animate-spin" />
            ) : (
              <FiShoppingCart className="w-4 h-4" />
            )}
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

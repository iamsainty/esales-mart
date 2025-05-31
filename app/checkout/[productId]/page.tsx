"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground text-sm">
          Complete your purchase below
        </p>
      </div>

      {/* Order Summary */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-full md:w-80 h-72 rounded-lg overflow-hidden">
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
              <p>
                <span className="font-medium">Minimum Order:</span>{" "}
                {product.minimumOrderQuantity}
              </p>
            </div>
            <div className="text-lg font-semibold text-green-600">
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
                  className="bg-muted px-2 py-1 text-xs rounded-full"
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
          <Input type="text" placeholder="Full Name" />
          <Input type="email" placeholder="Email" />
          <Input type="number" placeholder="Phone Number" />
          <Input type="text" placeholder="Address" />
          <Input type="text" placeholder="City" />
          <Input type="text" placeholder="State" />
          <Input type="number" placeholder="Zip Code" />
        </div>

        <div className="space-y-2 pt-6 max-w-md">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <p className="text-sm text-muted-foreground">
            Enter your card details below
          </p>
          <Input type="number" placeholder="Card Number" />
          <div className="flex gap-2">
            <Input type="date" placeholder="Expiry Date" />
            <Input type="number" placeholder="CVV" />
          </div>
        </div>

        <div className="pt-6 max-w-md">
          <Button className="w-full py-2.5 text-base font-semibold">
            Place Order
          </Button>
        </div>
      </section>

      {/* Info + Reviews */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Product Info */}
        <div className="bg-muted p-5 rounded-xl space-y-4">
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
        <div className="bg-muted p-5 rounded-xl space-y-3">
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

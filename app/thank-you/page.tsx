"use client";

import { Product } from "@/types/Product";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYou(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [productId, setProductId] = useState<number>(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("purchaseSuccess") !== "true") {
      router.push("/");
      return;
    }

    setName(localStorage.getItem("name") || "");
    setProductId(Number(localStorage.getItem("productId")));
    setQuantity(Number(localStorage.getItem("quantity")) || 0);
    setTotalPrice(Number(localStorage.getItem("totalPrice")) || 0);
    setEmail(localStorage.getItem("email") || "");
    setPhone(localStorage.getItem("phone") || "");
    setAddress(localStorage.getItem("address") || "");
    setCity(localStorage.getItem("city") || "");
    setState(localStorage.getItem("state") || "");
    setZip(localStorage.getItem("zip") || "");
  }, []);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://dummyjson.com/products/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="text-center py-10 text-muted-foreground">Loading...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="my-8">
        <h1 className="text-4xl font-bold">Thank You!</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          We appreciate your purchase. Your order is confirmed and being
          processed.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold my-6">Order Summary</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-60 h-60 rounded-lg overflow-hidden">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-5">
            <h3 className="text-xl font-semibold text-foreground">
              {product.title || "Product Name"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {product.description}
            </p>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium text-foreground">
                  Price per unit:
                </span>{" "}
                ${product.price?.toFixed(2)}
              </p>
              <p>
                <span className="font-medium text-foreground">Quantity:</span>{" "}
                {quantity}
              </p>
              <p>
                <span className="font-medium text-foreground">
                  Total Amount:
                </span>{" "}
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold my-6">Shipping Information</h2>
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>{name}</p>
            <p>{email}</p>
            <p>{phone}</p>
            <p>{address}</p>
            <p>
              {city}, {state} {zip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

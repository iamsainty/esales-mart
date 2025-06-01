"use client";

import { Product } from "@/types/Product";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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
  }, [router]);

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
      <div className="container mx-auto py-12 px-6 max-w-5xl space-y-10">
        {/* Back Button */}
        <div>
          <Button
            variant="outline"
            className="flex items-center gap-2 border border-black/50 rounded-none px-3 py-1 text-sm"
            disabled
          >
            ← Back to Home
          </Button>
        </div>

        {/* Thank You Header */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Order Summary */}
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="flex flex-col md:flex-row gap-10">
            <Skeleton className="relative w-full md:w-40 h-40 rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-10">
            <Skeleton className="h-8 w-60 mb-6" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-80" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="space-y-1">
        <h1 className="text-4xl font-semibold tracking-tight">Thank You!</h1>
        <p className="text-muted-foreground text-base">
          We appreciate your purchase. Your order is confirmed and being
          processed.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold my-6">Order Summary</h2>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="relative w-full md:w-40 h-40 rounded-lg overflow-hidden">
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

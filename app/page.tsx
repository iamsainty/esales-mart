"use client";

import { JSX, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/Product";

export default function Home(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("https://dummyjson.com/products");
      const data = await response.json();
      setProducts(data.products);
    };
    getProducts();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <header className="my-20 text-center">
        <h1 className="text-4xl font-bold mb-2">E-Sales Mart</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Discover our exclusive collection of products curated just for you.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className="hover:shadow-lg transition-shadow duration-300 border rounded-none overflow-hidden"
          >
            <div className="relative h-40 w-full">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1 text-lg font-semibold">
                {product.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm ">
              <p className="line-clamp-2 text-muted-foreground">
                {product.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Star className="w-4 h-4" />
                <span>{product.rating.toFixed(1)} / 5</span>
              </div>

              <div className="flex items-center justify-between text-base font-bold">
                <span>${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm font-semibold bg-muted px-2 py-0.5 rounded-md">
                    -{Math.round(product.discountPercentage)}% OFF
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Link href={`/checkout/${product.id}`} className="w-full mt-2">
                <Button className="w-full rounded-none cursor-pointer">
                  Buy Now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

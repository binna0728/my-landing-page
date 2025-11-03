"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
// Theme toggle removed (forced light mode)

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI로 펼치는 미래
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className="px-4 py-2 text-sm font-medium hover:underline">
                    홈
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="px-4 py-2 text-sm font-medium hover:underline">
                    소개
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/projects" className="px-4 py-2 text-sm font-medium hover:underline">
                    프로젝트
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/blog" className="px-4 py-2 text-sm font-medium hover:underline">
                    블로그
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/contact" className="px-4 py-2 text-sm font-medium hover:underline">
                    문의
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">메뉴 열기</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-lg font-medium hover:underline">
                홈
              </Link>
              <Link href="/about" className="text-lg font-medium hover:underline">
                소개
              </Link>
              <Link href="/projects" className="text-lg font-medium hover:underline">
                프로젝트
              </Link>
              <Link href="/blog" className="text-lg font-medium hover:underline">
                블로그
              </Link>
              <Link href="/contact" className="text-lg font-medium hover:underline">
                문의
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  );
}


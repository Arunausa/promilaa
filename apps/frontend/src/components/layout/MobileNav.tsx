"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "mr-2 md:hidden" })}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Link 
            href="/collections/kurti" 
            className="text-lg font-medium py-2 border-b"
            onClick={() => setOpen(false)}
          >
            Kurti
          </Link>
          <Link 
            href="/collections/one-piece" 
            className="text-lg font-medium py-2 border-b"
            onClick={() => setOpen(false)}
          >
            One Piece
          </Link>
          <Link 
            href="/collections/two-piece" 
            className="text-lg font-medium py-2 border-b"
            onClick={() => setOpen(false)}
          >
            Two Piece
          </Link>
          <Link 
            href="/collections/three-piece" 
            className="text-lg font-medium py-2 border-b"
            onClick={() => setOpen(false)}
          >
            Three Piece
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

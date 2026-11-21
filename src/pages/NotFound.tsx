import * as React from "react";
import { Link } from "react-router-dom";
import { notFound } from "@/content";
import { Nodey, Sprout } from "@/components/sketch";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-36 pb-24 text-center">
      <div className="flex items-end justify-center gap-4 mb-8">
        <Nodey size={92} boil />
        <Sprout size={76} wilted boil />
      </div>

      <h1 className="font-display-tight text-4xl sm:text-5xl text-ink">
        {notFound.heading}
      </h1>
      <p className="mt-4 text-lg text-ink-soft">{notFound.body}</p>

      <div className="mt-8">
        <Link
          to="/"
          className="sticker-btn rounded-sm font-display font-bold bg-blossom-600 text-white hover:bg-blossom-600/95 h-12 px-7 text-base"
        >
          {notFound.ctaLabel}
        </Link>
      </div>
    </section>
  );
}

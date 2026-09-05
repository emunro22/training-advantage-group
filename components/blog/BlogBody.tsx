import type { BlogBodyBlock } from "@/lib/blogPosts";
import { CheckCircle2 } from "lucide-react";

/** Renders a blog post's typed body blocks (heading / paragraph / list) with the site's
 * standard article typography. Server component — no interactivity needed. */
export default function BlogBody({ blocks }: { blocks: BlogBodyBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2 key={i} className="text-xl md:text-2xl font-bold text-navy pt-2">
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="space-y-2">
              {block.items?.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-700 leading-relaxed">
                  <CheckCircle2 size={16} className="text-blue-brand flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-gray-600 leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

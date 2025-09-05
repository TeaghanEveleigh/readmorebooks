import DOMPurify from "isomorphic-dompurify";

export function sanitiseGoogleHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["i","em","b","strong","br","p","ul","ol","li","a"],
    ALLOWED_ATTR: ["href","title","target","rel"],
  });
}

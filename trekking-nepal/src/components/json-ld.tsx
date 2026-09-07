/**
 * Serialises a schema.org object into a JSON-LD script tag.
 * `<` is escaped so a stray "</script>" inside content can't break out.
 */
export function JsonLd({ data, id }: { data: unknown; id?: string }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

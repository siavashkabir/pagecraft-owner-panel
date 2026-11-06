<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep splash timing and easing in a browser-safe pure module so motion timing can be regression-tested without canvas.
- Public site_settings reads must use the database allowlist predicate for both record key and JSON fields; all other settings stay admin-only to prevent future private settings leaking.
- Storefront reads use public server functions with RLS; the admin product query is separate so unpublished products remain editable without entering public caches.
- Product taxonomy and subscription helpers live in a browser-safe module; both legacy bot URLs and shop URLs render the same product detail to preserve published links.
- Project service requests use validated public server functions and the existing private messages inbox, keeping contact details restricted to admins.

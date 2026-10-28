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

- Event (marosim) types: built-in defaults and images live in src/lib/events.ts; admins override name/heading/message/extra images via the event_types table, merged by mergeEvents. Why: site works even if the database is empty.
- Admin role: first signed-up user is auto-assigned admin via a trigger on user_roles. Why: owner can claim /admin without manual setup.

# PowerNexa Consulting Production Website

A production-oriented static website for GitHub Pages.

## Included

- Multi-page maintainable structure
- Responsive navigation
- Dark/light mode with saved preference
- Loading screen and scroll progress
- Scroll reveal animations
- Animated counters
- Interactive tilt cards
- Testimonials slider
- FAQ accordion
- Floating contact button
- Demo chat panel
- Services, projects, insights, careers, contact, privacy, and 404 pages
- `CNAME`, `robots.txt`, `sitemap.xml`, and web manifest
- Accessible semantic HTML and reduced-motion support

## Important production checks

1. Replace placeholder testimonials with approved client feedback.
2. Verify every metric and public project claim.
3. Replace social links and business contact details.
4. Connect the contact form to a secure backend if you do not want a `mailto:` workflow.
5. Replace the demo chat with a real provider or remove it.
6. Review the privacy notice with a qualified professional.
7. Add approved analytics and cookie consent only when required.
8. Optimize the supplied logo for web and create dedicated favicon sizes.

## Publish to GitHub

Copy all files into the cloned repository folder. Keep the `.git` folder.

```powershell
git status
git add .
git commit -m "Launch production website"
git pull origin main --rebase
git push origin main
```

GitHub Pages will deploy from the configured `main` branch.

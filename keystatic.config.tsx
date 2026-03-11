import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: { kind: "local" },

  ui: {
    brand: { name: "DevBlog Admin" },
    navigation: {
      "Content": ["posts"],
      "Settings": ["siteSettings"],
    },
  },

  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date", "draft", "featured"],
      schema: {
        // ─── Core ────────────────────────────────────────────────────
        title: fields.slug({
          name: {
            label: "Post Title",
            description: "The main headline. This also generates the URL slug — e.g. 'My First Post' becomes /blog/my-first-post",
            validation: { isRequired: true },
          },
        }),

        description: fields.text({
          label: "Description / Excerpt",
          description: "One or two sentences summarising the post. Shown in listing cards, SEO meta tags, and social shares. Keep under 160 characters.",
          multiline: true,
          validation: { isRequired: true, length: { max: 300 } },
        }),

        date: fields.date({
          label: "Publish Date",
          description: "Date the post is published. Format: YYYY-MM-DD",
          validation: { isRequired: true },
          defaultValue: { kind: "today" },
        }),

        updatedAt: fields.date({
          label: "Last Updated Date",
          description: "Optional — fill in when you update an existing post.",
        }),

        // ─── Cover Image ──────────────────────────────────────────────
        image: fields.text({
          label: "Cover Image URL",
          description: [
            "Paste a full image URL here. Examples:",
            "• Unsplash: https://images.unsplash.com/photo-XXXXX?w=1200&h=630&fit=crop",
            "• Imgur:    https://i.imgur.com/XXXXX.jpg",
            "• Leave blank to show a styled letter placeholder instead.",
          ].join("\n"),
        }),

        imageAlt: fields.text({
          label: "Cover Image Alt Text",
          description: "Describe the image for screen readers and SEO. Required if you added an image URL above.",
        }),

        // ─── Author ───────────────────────────────────────────────────
        author: fields.text({
          label: "Author Name",
          description: "Full name shown in the post author card.",
          defaultValue: "Sandeep Kumar Pati",
          validation: { isRequired: true },
        }),

        authorBio: fields.text({
          label: "Author Bio",
          description: "Short bio shown below the post. e.g. 'Full Stack Developer based in Pune, India.'",
          multiline: true,
          defaultValue: "Full Stack Developer based in Pune, India. Passionate about TypeScript, React, and modern web development.",
        }),

        authorGithub: fields.text({
          label: "Author GitHub Username",
          description: "Just the username — e.g. sandy1997-dev (not the full URL)",
          defaultValue: "sandy1997-dev",
        }),

        authorTwitter: fields.text({
          label: "Author Twitter / X Handle",
          description: "Include the @ symbol — e.g. @KumarSande7673",
          defaultValue: "@KumarSande7673",
        }),

        // ─── Tags ─────────────────────────────────────────────────────
        tags: fields.array(
          fields.text({
            label: "Tag",
            description: "e.g. TypeScript, React, Node.js, MongoDB, Next.js",
          }),
          {
            label: "Tags",
            description: "Add relevant topic tags. These are used for filtering and SEO.",
            itemLabel: (props) => props.value || "New tag",
          }
        ),

        // ─── Series ───────────────────────────────────────────────────
        series: fields.text({
          label: "Series Name",
          description: "Optional — group related posts. e.g. 'TypeScript Mastery' or 'Next.js Deep Dives'. Leave blank if standalone post.",
        }),

        seriesOrder: fields.number({
          label: "Position in Series",
          description: "Order within the series — 1 = first, 2 = second, etc. Only needed if Series Name is set.",
          validation: { min: 1 },
        }),

        // ─── Display Options ──────────────────────────────────────────
        featured: fields.checkbox({
          label: "Featured Post",
          description: "Show this post in the hero section on the homepage. Only one or two posts should be featured at a time.",
          defaultValue: false,
        }),

        draft: fields.checkbox({
          label: "Draft (Hidden)",
          description: "Drafts are invisible in production. Only visible in local development. Uncheck to publish.",
          defaultValue: false,
        }),

        toc: fields.checkbox({
          label: "Show Table of Contents",
          description: "Auto-generates a sidebar TOC from your headings (H2 and H3). Recommended for long posts.",
          defaultValue: true,
        }),

        // ─── Content ──────────────────────────────────────────────────
        content: fields.mdx({
          label: "Post Content",
          description: "Write your post here. Supports full Markdown: headings, bold, italic, links, code blocks, tables, blockquotes.",
          options: {
            heading:    [2, 3, 4],
            bold:       true,
            italic:     true,
            strikethrough: true,
            code:       true,
            link:       true,
            image:      false,
            table:      true,
            divider:    true,
            blockquote: true,
            codeBlock: {
              schema: {
                language: fields.text({ label: "Language", description: "e.g. typescript, javascript, bash, json" }),
                filename: fields.text({ label: "File name (optional)", description: "e.g. src/app/page.tsx" }),
              },
            },
          },
        }),
      },
    }),
  },

  singletons: {
    siteSettings: singleton({
      label: "Site Settings",
      path: "content/site-settings",
      schema: {
        siteName: fields.text({
          label: "Site Name",
          description: "Shown in the header logo and browser tab. e.g. DevBlog",
          defaultValue: "DevBlog",
          validation: { isRequired: true },
        }),
        tagline: fields.text({
          label: "Tagline",
          description: "Short phrase under the site name. e.g. Engineering Perspectives",
          defaultValue: "Engineering Perspectives",
        }),
        description: fields.text({
          label: "Site Description",
          description: "Used in SEO meta tags and the homepage hero. Keep under 160 characters.",
          multiline: true,
          defaultValue: "In-depth articles on software engineering, system design, TypeScript, React, and modern web development.",
        }),
        authorName: fields.text({
          label: "Your Full Name",
          defaultValue: "Sandeep Kumar Pati",
        }),
        authorEmail: fields.text({
          label: "Your Email",
          description: "Used in RSS feed and contact links.",
          defaultValue: "sandeepkumar.pati1997@gmail.com",
        }),
        github: fields.text({
          label: "GitHub Profile URL",
          description: "Full URL — e.g. https://github.com/sandy1997-dev",
          defaultValue: "https://github.com/sandy1997-dev",
        }),
        twitter: fields.text({
          label: "Twitter / X Profile URL",
          description: "Full URL — e.g. https://x.com/KumarSande7673",
          defaultValue: "https://x.com/KumarSande7673",
        }),
        linkedin: fields.text({
          label: "LinkedIn Profile URL",
          description: "Optional. e.g. https://linkedin.com/in/yourprofile",
        }),
      },
    }),
  },
});

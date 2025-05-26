import { defineStackbitConfig, SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: '~0.8.0',
  ssgName: 'nextjs',
  nodeVersion: '20',
  
  // Define your content sources (Git-based CMS in this case)
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        // Basic page model
        {
          name: "Page",
          type: "page",
          urlPath: "/{slug}",
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "content", type: "markdown" }
          ]
        },
        // Blog post model example
        {
          name: "BlogPost",
          type: "page",
          urlPath: "/blog/{slug}",
          filePath: "content/blog/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "date", type: "date", required: true },
            { name: "author", type: "string" },
            { name: "excerpt", type: "string" },
            { name: "content", type: "markdown" },
            { 
              name: "categories", 
              type: "list", 
              items: { type: "string" } 
            }
          ]
        }
      ]
    })
  ],

  // Map content to URLs
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === "page");
    
    return documents
      .filter((doc) => pageModels.some(m => m.name === doc.modelName))
      .map((document) => {
        let urlPath = '';
        
        // Custom URL mapping based on document type
        switch (document.modelName) {
          case 'Page':
            urlPath = `/${document.slug}`;
            break;
          case 'BlogPost':
            urlPath = `/blog/${document.slug}`;
            break;
          default:
            return null;
        }
        
        return {
          stableId: document.id,
          urlPath,
          document,
          isHomePage: document.slug === 'home', // Mark the home page
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },
  
  // Optional: Configure the UI
  ui: {
    navigation: {
      pages: {
        include: ['Page'],
        exclude: ['BlogPost']
      },
      data: {
        include: [],
        exclude: []
      }
    },
    sidebar: {
      default: {
        groups: [
          { type: 'Page', label: 'Pages' },
          { type: 'BlogPost', label: 'Blog Posts' }
        ]
      }
    }
  }
});

import { defineStackbitConfig, type SiteMapEntry, type DocumentWithSource } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

// Extend the DocumentWithSource type to include our custom fields
type CustomDocument = DocumentWithSource & {
  fields?: {
    slug?: string;
    title?: string;
    [key: string]: any;
  };
  slug?: string;
  title?: string;
};

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
      .filter((doc): doc is CustomDocument => {
        // Type guard to ensure document has slug and is a page model
        const docWithFields = doc as CustomDocument;
        const hasSlug = 
          (docWithFields.fields && 'slug' in docWithFields.fields) || 
          'slug' in docWithFields;
        return pageModels.some(m => m.name === doc.modelName) && hasSlug;
      })
      .map((document) => {
        let urlPath = '';
        const slug = (document.slug || document.fields?.slug || '').toString();
        
        // Custom URL mapping based on document type
        switch (document.modelName) {
          case 'Page':
            urlPath = `/${slug}`;
            break;
          case 'BlogPost':
            urlPath = `/blog/${slug}`;
            break;
          default:
            return null;
        }
        
        return {
          stableId: document.id,
          urlPath,
          document,
          isHomePage: slug === 'home', // Mark the home page
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },
  
  // UI configuration is now handled through the Stackbit UI configuration
  // in the Stackbit dashboard or via the stackbit.yaml file
});

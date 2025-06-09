---
trigger: always_on
---

Systematic Naming & ID Structure Guide
Core Principles
	1. Descriptive: Names indicate purpose/context
	2. Hierarchical: Structure reflects relationships
	3. Consistent: Same patterns throughout codebase
	4. Unique: No duplicate IDs within scope
Naming Pattern
{scope}_{type}_{descriptor}_{variant}
Examples: header_nav_primary_mobile, user_form_login_main
File Naming
Components: PascalCase.jsx (UserProfile.jsx) Utils: camelCase.js (dateHelpers.js) Styles: kebab-case.css (base-styles.css) Assets: kebab-case.ext (company-logo.svg)
ID System
Format: {component}-{section}-{element}-{modifier?}
Examples:
	• Layout: page-header-container, main-nav-menu
	• Interactive: login-form-submit-btn, modal-close-btn
	• Content: hero-section-wrapper, product-grid-container
Component Structure
function UserProfile() {
  return (
    <div id="user-profile-container">
      <header id="user-profile-header">
        <img id="user-profile-avatar" />
        <h1 id="user-profile-name">{name}</h1>
      </header>
      <nav id="user-profile-tabs">
        <button id="user-profile-tab-posts">Posts</button>
      </nav>
      <main id="user-profile-content">
        <section id="user-profile-posts"></section>
      </main>
    </div>
  );
}
Asset Naming
Images: {category}_{purpose}_{variant}.ext
	• logo_company_primary.svg
	• icon_arrow_right_white.svg
	• bg_hero_gradient.jpg
API Endpoints: /api/kebab-case
	• /api/user-profiles
	• /api/product-categories
Structure Analysis
Audit Checklist:
	• [ ] Consistent file naming conventions
	• [ ] No duplicate IDs within components
	• [ ] Logical directory organization
	• [ ] All interactive elements have unique IDs
	• [ ] Hierarchical ID structure maintained
Red Flags:
	• Mixed naming conventions
	• Duplicate IDs detected
	• Generic names (div1, button2)
	• Unclear file organization
Auto-Generated IDs
// React hook for unique IDs
function useUniqueId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2,5)}`;
}
CSS Integration
/* Use IDs for unique styling */
#main-navigation-header { position: sticky; }
/* Combine with BEM classes */
.user-profile__header { }
.user-profile--premium { }
Quality Gates
Before Implementation:
	• [ ] All elements have descriptive IDs
	• [ ] No naming conflicts exist
	• [ ] File structure is logical
	• [ ] Naming patterns are consistent
Restructure Triggers:
	• Duplicate IDs found
	• Generic naming detected
	• Poor file organization
	• Missing component identifiers
Implementation Priority
	1. Phase 1: Audit existing structure
	2. Phase 2: Identify naming violations
	3. Phase 3: Propose systematic fixes
	4. Phase 4: Generate unique IDs for elements
	5. Phase 5: Validate no duplicates/conflicts
Apply these rules consistently to ensure every file, component, and DOM element has a unique, predictable identifier for easy navigation and editing.

From <https://claude.ai/chat/a004a81d-3526-41c5-bf0d-6fc4d9156f7e> 


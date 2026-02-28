# ONES Brand Reference

Based on ones.com website analysis.

## Brand Identity

**Tagline:** "All-in-one Project Management Tool for Enterprise"

**Products:**
- ONES Project - Project management
- ONES Wiki - Knowledge base
- ONES Copilot - AI assistant

**Trust Signals:**
- 4.5/5.0 rating
- SOC2, GDPR certified
- 200,000+ customers
- Enterprise-grade security

## Colors (Based on Atlassian-style Enterprise SaaS)

```css
/* Primary - Professional Blue */
--primary: #0052CC;
--primary-dark: #0747A6;
--primary-light: #4C9AFF;

/* Secondary - Neutral */
--secondary: #6B778C;
--secondary-dark: #505F79;

/* Accent - Vibrant */
--accent: #FF5630; /* Orange/Red for highlights */
--accent-green: #36B37E; /* Success */
--accent-yellow: #FFAB00; /* Warning */

/* Background */
--bg-primary: #FFFFFF;
--bg-secondary: #F4F5F7;
--bg-tertiary: #EBECF0;

/* Text */
--text-primary: #172B4D;
--text-secondary: #6B778C;
--text-muted: #97A0AF;

/* Borders */
--border: #DFE1E6;
--border-dark: #C1C7D0;
```

## Typography

```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Heading Sizes */
--h1: 2.5rem; /* 40px */
--h2: 2rem;   /* 32px */
--h3: 1.5rem; /* 24px */
--h4: 1.25rem; /* 20px */

/* Body Sizes */
--body-large: 1.125rem; /* 18px */
--body: 1rem;           /* 16px */
--body-small: 0.875rem; /* 14px */
```

## Component Styles

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: #0052CC;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
}
.btn-primary:hover {
  background: #0747A6;
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: #0052CC;
  border: 1px solid #0052CC;
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  border: 1px solid #DFE1E6;
}
.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

### Badges
```css
.badge-verified {
  background: #E3FCEF;
  color: #36B37E;
}

.badge-spotlight {
  background: #FFF0B3;
  color: #FF8B00;
}

.badge-cloud {
  background: #DEEBFF;
  color: #0747A6;
}
```

## Design Principles

1. **Enterprise-Grade:** Professional, trustworthy, secure
2. **Clean & Modern:** Minimal clutter, clear hierarchy
3. **Accessible:** High contrast, readable fonts
4. **Consistent:** Uniform spacing and alignment

## Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
```

## Icons

Use emoji or simple icons for categories:
- 📁 Project Management
- ⚡ Automation
- 🔧 Development Tools
- 🤝 Collaboration
- 📊 Reports
- 🛡️ Security
- 🤖 AI Enhanced
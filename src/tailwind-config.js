tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#54e98a", "on-primary": "#003919",
        "primary-container": "#2ecc71", "on-primary-container": "#005027",
        "primary-fixed": "#6bfe9c", "primary-fixed-dim": "#4ae183",
        "on-primary-fixed": "#00210c", "on-primary-fixed-variant": "#005228",
        "inverse-primary": "#006d37",
        "secondary": "#bcc9ca", "on-secondary": "#263334",
        "secondary-container": "#3f4b4c", "on-secondary-container": "#aebbbc",
        "secondary-fixed": "#d8e5e6", "secondary-fixed-dim": "#bcc9ca",
        "on-secondary-fixed": "#121e1f", "on-secondary-fixed-variant": "#3d494a",
        "tertiary": "#ffbfb5", "on-tertiary": "#690001",
        "tertiary-container": "#ff9687", "on-tertiary-container": "#8e0505",
        "tertiary-fixed": "#ffdad5", "tertiary-fixed-dim": "#ffb4a9",
        "on-tertiary-fixed": "#410000", "on-tertiary-fixed-variant": "#910807",
        "error": "#ffb4ab", "on-error": "#690005",
        "error-container": "#93000a", "on-error-container": "#ffdad6",
        "background": "#0e150f", "on-background": "#dce5da",
        "surface": "#0e150f", "surface-dim": "#0e150f",
        "surface-bright": "#333b34",
        "surface-container-lowest": "#09100a", "surface-container-low": "#161d17",
        "surface-container": "#1a211b", "surface-container-high": "#242c25",
        "surface-container-highest": "#2f372f",
        "on-surface": "#dce5da", "on-surface-variant": "#bbcbbb",
        "outline": "#869486", "outline-variant": "#3d4a3e",
        "inverse-surface": "#dce5da", "inverse-on-surface": "#2b322b",
        "surface-tint": "#4ae183", "surface-variant": "#2f372f",
        "terminal-bg": "#0f1419", "terminal-border": "#1e2933", "terminal-text": "#e2e8f0"
      },
      borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
      spacing: { "xs": "4px", "sm": "8px", "md": "16px", "lg": "24px", "xl": "48px", "gutter": "24px", "margin": "32px", "unit": "4px" },
      fontFamily: {
        "code-block": ["Fira Code", "monospace"],
        "body-md": ["Lexend", "sans-serif"], "body-lg": ["Lexend", "sans-serif"],
        "label-caps": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"], "headline-lg": ["Space Grotesk", "sans-serif"]
      },
      fontSize: {
        "code-block":  ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-md":     ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg":     ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-caps":  ["12px", { lineHeight: "1",   fontWeight: "600", letterSpacing: "0.05em" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }]
      }
    }
  }
};

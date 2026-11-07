// SVGR options used by react-native-svg-transformer (see metro.config.js).

// Gradient, pattern and clip-path ids inside an SVG are global on web: when the
// same illustration is drawn twice (or sits in a hidden screen), `url(#lid)`
// can resolve to a copy that isn't rendered and the fill disappears. The
// template below gives every rendered instance its own suffix (React useId),
// rewriting id="…", url(#…) and href="#…" to match. Native is unaffected.

const URL_REF = /url\(#([^)]+)\)/g;
const UID = Symbol("uid");

/** Build a JSX attribute value `{`...${uid}...`}` from strings and UID markers. */
function templateLiteral(parts) {
  const quasis = [];
  const expressions = [];
  let text = "";
  for (const part of parts) {
    if (part === UID) {
      quasis.push({ type: "TemplateElement", value: { raw: text, cooked: text }, tail: false });
      expressions.push({ type: "Identifier", name: "uid" });
      text = "";
    } else {
      text += part.replace(/[`\\$]/g, (c) => `\\${c}`);
    }
  }
  quasis.push({ type: "TemplateElement", value: { raw: text, cooked: text }, tail: true });
  return { type: "JSXExpressionContainer", expression: { type: "TemplateLiteral", quasis, expressions } };
}

function rewriteValue(name, value) {
  if (name === "id") return templateLiteral([value, "-", UID]);
  if ((name === "href" || name === "xlinkHref") && value.startsWith("#")) return templateLiteral([value, "-", UID]);
  if (value.includes("url(#")) {
    const parts = [];
    let last = 0;
    for (const match of value.matchAll(URL_REF)) {
      parts.push(value.slice(last, match.index), `url(#${match[1]}-`, UID, ")");
      last = match.index + match[0].length;
    }
    parts.push(value.slice(last));
    return templateLiteral(parts);
  }
  return null;
}

/** Rewrite id references in a JSX tree; returns true when something changed. */
function scopeIds(node) {
  if (!node || node.type !== "JSXElement") return false;
  let changed = false;
  for (const attr of node.openingElement.attributes) {
    if (attr.type !== "JSXAttribute" || !attr.value || attr.value.type !== "StringLiteral") continue;
    const name = attr.name.type === "JSXIdentifier" ? attr.name.name : attr.name.name.name;
    const next = rewriteValue(name, attr.value.value);
    if (next) {
      attr.value = next;
      changed = true;
    }
  }
  for (const child of node.children) changed = scopeIds(child) || changed;
  return changed;
}

function template(variables, { tpl }) {
  if (!scopeIds(variables.jsx)) {
    return tpl`
${variables.imports};
${variables.interfaces};
const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);
${variables.exports};
`;
  }
  return tpl`
import { useId } from "react";
${variables.imports};
${variables.interfaces};
const ${variables.componentName} = (${variables.props}) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    ${variables.jsx}
  );
};
${variables.exports};
`;
}

module.exports = {
  template,
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            // Keep the viewBox so illustrations scale to any size we give them.
            removeViewBox: false,
            // Keep ids readable and unmerged; the template above scopes them.
            cleanupIds: false,
            inlineStyles: false,
          },
        },
      },
    ],
  },
};

import { lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightSpecialChars } from "@codemirror/view";
import { foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { EditorView } from "@codemirror/view";

export const basicSetup = [
  highlightSpecialChars(),
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  drawSelection(),
  dropCursor(),
  rectangularSelection(),
  crosshairCursor(),
  foldGutter(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  highlightSelectionMatches(),
];
import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";


const modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ script: "sub" }, { script: "super" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }]
    ],
    handlers: {
      image: function() {
        const editor = this.quill;
        const range = editor.getSelection();
        const value = prompt("Please paste the image url here.");
        if (value) {
          editor.insertEmbed(range.index, "image", value);
        }
      }
    }
  }
};

const TextEditor = ({ name, label, onChange, value, error }) => {
  const { quill, quillRef } = useQuill({ modules, formats: {} });

  useEffect(() => {
    if (quill && value && value !== quill.container.firstChild.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value, quill]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        onChange({ currentTarget: { value: quill.container.firstChild.innerHTML, name } });
      });
    }
    // eslint-disable-next-line
  }, [quill]);

  return (
    <div style={{ width: "100%", height: "auto", margin: "0.2rem" }}>
      <label htmlFor={name}>{label}</label>
      <div id={name} ref={quillRef} />
      {error && <div className="alert-danger">{error}</div>}
      <br />
    </div>
  );
};

export default TextEditor;

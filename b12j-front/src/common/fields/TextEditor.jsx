import React, {useEffect} from 'react';

const TextEditor = ({onChange, name = "testEditor", label = "Hello editor", value = ""}) => {
  const Quill = window.Quill;

  const handleChange = (content) => {
    const obj = {currentTarget: {name: name, value: content}}
    onChange(obj)
  }

  const imageHandler = (editor) => {
    const range = editor.getSelection();
    const value = prompt('please copy paste the image url here.');
    if (value) {
      editor.insertEmbed(range.index, 'image', value, Quill.sources.USER);
    }
  }

  const editorScript = () => {
    const editor = new Quill("#" + name, {
      'theme': 'snow', 'modules': {
        'toolbar': {
          'container': [['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'], ['link', 'image'], [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}], [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}], [{'align': []}]],
          handlers: {image: () => imageHandler(editor)}
        }
      }
    });
    editor.container.firstChild.innerHTML = value;
    editor.on('text-change', () => {
      handleChange(editor.container.firstChild.innerHTML);
    });
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerText = editorScript();
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
    // eslint-disable-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <label htmlFor={name}><h3>{label}</h3></label>
      <div id={name}/>
    </div>
  );
};

export default TextEditor;
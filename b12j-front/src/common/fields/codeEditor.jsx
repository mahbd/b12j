import React, {useEffect} from 'react';

const CodeEditor = ({mode, theme, font, name, value, label, onChange}) => {

    const editorContainer = React.createRef();

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';

        script.innerText = `ace.require("ace/ext/language_tools");
        var editor = ace.edit("${name + "c"}");
        editor.session.setMode("ace/mode/${mode}");
        editor.setTheme("ace/theme/${theme}");
        editor.getSession().setUseWorker(true);
        editor.setValue("${value}");
        editor.clearSelection();
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        editor.setFontSize("${font}px");
        editor.commands.addCommand({
            name: "showKeyboardShortcuts",
            bindKey: {win: "Ctrl-h", mac: "Command-Alt-h"},
            exec: function (editor) {
                ace.config.loadModule("ace/ext/keybinding_menu", function (module) {
                    module.init(editor);
                    editor.showKeyboardShortcuts()
                })
            }
        });
        var textarea = document.getElementById('${name}');
        editor.getSession().on("change", function () {
            textarea.value = editor.getSession().getValue();
        });`
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [font, mode, name, theme]);

    const handleChange = () => {
        const value = editorContainer.current.value;
        const obj = {currentTarget: {name: name, value: value}};
        onChange(obj)
    }

    return (
        <React.Fragment>
            <label htmlFor={name + "c"}><h3>{label}</h3></label>
            <div id={name + "c"} onKeyUp={handleChange} style={{height: "300px", width: "100%"}} />
            <textarea id={name} className="ace_code_editor" name={name} ref={editorContainer}
                      style={{display: "none"}}/>
        </React.Fragment>
    )
}

export default CodeEditor;
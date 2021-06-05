import React, {useEffect} from 'react';

const CodeEditor = ({mode, theme, font, name, value, label, onChange}) => {
    const handleChange = (content) => {
        const obj = {currentTarget: {name: name, value: content}}
        onChange(obj)
    }

    const editorScript = () => {
        const ace = window.ace;
        const editor = ace.edit(name);
        editor.session.setMode("ace/mode/" + mode);
        editor.setTheme("ace/theme/" + theme);
        editor.getSession().setUseWorker(true);
        editor.setValue(value);
        editor.clearSelection();
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        editor.setFontSize(font + "px");
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

        editor.getSession().on("change", function () {
            handleChange(editor.getSession().getValue());
        });
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';

        script.innerText = editorScript();
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
        // eslint-disable-line react-hooks/exhaustive-deps
    }, [font, mode, name, theme]);

    return (
        <React.Fragment>
            <label htmlFor={name}><h3>{label}</h3></label>
            <div id={name} style={{height: "300px", width: "100%"}}/>
        </React.Fragment>
    )
}

export default CodeEditor;
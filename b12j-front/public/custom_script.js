function imageHandler() {
    const range = this.quill.getSelection();
    const value = prompt('please copy paste the image url here.');
    if (value) {
        this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
    }
}

const quillConfig = {
    'theme': 'snow', 'modules': {
        'toolbar': {
            'container': [['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'], ['link', 'image'], [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}], [{'header': [1, 2, 3, 4, 5, 6, false]}], [{'color': []},
                    {'background': []}], [{'align': []}]], handlers: {image: imageHandler}
        }
    }
}

const quillList = document.getElementsByClassName('quill-editor');
for (let i = 0; i < quillList.length; i++) {
    new Quill(`#${quillList[i].id}`, quillConfig);
}

ace.require("ace/ext/language_tools");
function aceEditor(id, targetId, mode="c_cpp", theme="chrome", value="in\nv", font="17") {
    const editor = ace.edit(id);
    editor.session.setMode(`ace/mode/${mode}`);
    editor.setTheme(`ace/theme/${theme}`);
    editor.getSession().setUseWorker(true);
    editor.clearSelection();
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setFontSize(`${font}px`);
    editor.setValue(value);
    editor.clearSelection();
    editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: {win: "Ctrl-h", mac: "Command-Alt-h"},
        exec: function (editor) {
            ace.config.loadModule("ace/ext/keybinding_menu", function (module) {
                module.init(editor);
                editor.showKeyboardShortcuts()
            });
        }
    });
    const textarea = document.getElementById(targetId);
    editor.getSession().on("change", function () {
        textarea.value = editor.getSession().getValue();
    });
}

console.log(document.getElementsByClassName('ace-editor'));

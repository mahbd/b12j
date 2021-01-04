import React, {Component} from 'react';

export default class TextEditor extends Component {

    constructor(props) {
        super(props);
        this.editorContainer = React.createRef();
    }

    componentDidMount() {
        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.async = true;
        script2.innerText = "function imageHandler() {var range = this.quill.getSelection();" +
            "var value = prompt('please copy paste the image url here.');" +
            "if (value) {this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);}}"
        document.body.appendChild(script2);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;

        script.innerText = `var editor = new Quill('#${this.props.name}',
        {'theme': 'snow', 'modules':{'toolbar':{ 'container': [ ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'], ['link', 'image'], [{'list': 'ordered'}, {'list': 'bullet'}],
         [{'script': 'sub'}, {'script': 'super'}], [{'header': [1, 2, 3, 4, 5, 6, false]}], [{'color': []},
          {'background': []}], [{'align': []}]], handlers:{image: imageHandler}  } }});`;

        document.body.appendChild(script);
    }

    formatHtml = (text) => {
        if (text) {
            return {__html: `${text}`}
        }
        return {__html: "<span />"}
    }

    extract = () => {
        let content = this.editorContainer.current.getElementsByClassName('ql-editor')[0]
        const obj = {currentTarget: {name: this.props.name, value: content.innerHTML}}
        this.props.onChange(obj)
    }

    render() {
        const {label, name, value} = this.props
        return (
            <React.Fragment>
                <label htmlFor={name}><h3>{label}</h3></label>
                <div ref={this.editorContainer} id={name} onKeyUp={this.extract}
                     dangerouslySetInnerHTML={this.formatHtml(value)}/>
            </React.Fragment>
        )
    }
}
import React, {Component} from 'react';
import moment from "moment";
import {Link} from "react-router-dom";
import {css} from "../configuration";

export const createTitle = (title, link, className = "h1") => {
    return link ? <Link to={link}>
        <div className={className + css.center}>{title}</div>
    </Link> : <div className={className + css.center}>{title}</div>
};

export const createLeft = (textList, {textListClass = css.username, constText = "Written By:", constClass = ""}) => {
    return <div className={"col " + constClass}> {constText}
        <span className={textListClass}>{textList.join("\n")}</span>
    </div>
};

export const createRight = (textList, {textListClass = css.username, constText = "Written By:", constClass = "text-dark", hidePhone = true}) => {
    return <div className={"col" + css.alignRight}>
            <span className={(hidePhone && css.hideOnPhone)}> {constText}
                <span className={textListClass}>{textList.join("\n")}</span>
            </span>
    </div>
};

export const extractDate = (dateString) => {
    const dateObj = new Date(dateString);
    return moment(dateObj).format("D MMM YY:::H:m")
}

const formatHtml = (text) => {
    if (text) {
        return {__html: `${text}`}
    }
    return {__html: "<span />"}
}

export const FormattedHtml = ({text}) => <div dangerouslySetInnerHTML={formatHtml(text)}/>

class ObjectView extends Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

export default ObjectView;
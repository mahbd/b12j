import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";

import './common/cssLibrary.css';
import ParentApp from "./parentApp";

ReactDOM.render(
    <BrowserRouter>
        <ParentApp />
    </BrowserRouter>,
    document.getElementById('root')
);


export const css = {
    navBar: " navbar-dark font-weight-bold bgDarkBlue ",
    navSuccessButton: ' btn btn-outline-success ',
    center: " d-flex justify-content-center ",
    alignRight: " d-flex flex-row-reverse ",
    hideOnPhone: " d-none d-lg-block d-xl-block ",
    username: " nobr text-danger font-weight-bold ",
};
const getEndpoint = () => {
    if (document.domain === "localhost") return "http://127.0.0.1:8000";
    else return document.location.protocol + "//" + document.location.host
}

export const endpoint = getEndpoint();
export const apiEndpoint = endpoint + "/api";

export const wssURL = () => {
    const protocol = document.location.protocol === "https:" ? "wss://" : "ws://";
    if (document.domain === "localhost") return protocol + "127.0.0.1:8000/ws";
    return protocol + document.location.host + "/ws";
}

export const urls = {
    contests: '/contests',
    submissions: '/submissions',
    standing: '/contests/standing',
    problems: '/problems',
    tutorials: '/tutorials',
    chat: '/chat',
    cf: '/cf',
    cfProblems: 'cf/problems',
    cfStatics: 'cf/statics',
    users: '/users',
    login: '/users/login',
    register: '/users/register',
    logout: '/users/logout',
};

export const navBar = {
    menuLeft: [
        {
            label: 'Home',
            link: '/',
        },
        {
            label: 'Bulletin',
            link: '/bulletin',
        }
        ,
        {
            label: 'Chat',
            link: urls.chat,
        },
        {
            label: 'Contests',
            link: urls.contests,
            sub: [
                {
                    label: 'Contest List',
                    link: urls.contests,
                },
                {
                    label: 'Submissions',
                    link: urls.submissions,
                },
                {
                    label: 'Standing',
                    link: urls.standing,
                },
            ]
        },
        {
            label: 'Tutorials',
            link: urls.tutorials,
        },
        {
            label: 'Codeforces',
            link: urls.cf,
            sub: [
                {
                    label: 'Problems',
                    link: urls.cfProblems
                },
                {
                    label: 'Statics',
                    link: urls.cfStatics
                }
            ]
        }
    ],

    menuRight: [
        {
            label: 'Login',
            link: urls.login,
            // class: css.navSuccessButton,
        },
        {
            label: 'Register',
            link: urls.register,
            // class: css.navSuccessButton,
        }
    ]
}

export const firebaseConfig = {
    apiKey: "AIzaSyB9n-TJY1hy49WoECQH7fZXlxA7lKI2VH4",
    authDomain: "b12j-mah.firebaseapp.com",
    databaseURL: "https://b12j-mah.firebaseio.com",
    projectId: "b12j-mah",
    storageBucket: "b12j-mah.appspot.com",
    messagingSenderId: "704405925886",
    appId: "1:704405925886:web:2066da3c25584a7ed4daaf",
    measurementId: "G-XE9M4QRX4J"
};

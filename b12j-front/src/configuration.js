export const css = {
    navBar: " navbar-dark font-weight-bold bgDarkBlue ",
    navSuccessButton: ' btn btn-outline-success ',
    center: " d-flex justify-content-center ",
    alignRight: " d-flex flex-row-reverse ",
    hideOnPhone: " d-none d-lg-block d-xl-block ",
    username: " nobr text-danger font-weight-bold ",
};

export const minRefreshTime = 60;
export const jwtTokenKey = "token";

const apiURL = () => {
    if (document.domain === "localhost") return "http://127.0.0.1:8000/api";
    else return document.location.protocol + "//" + document.location.host + "/api"
}

export const apiEndpoint = apiURL();

export const wssURL = () => {
    const protocol = document.location.protocol === "https:" ? "wss://" : "ws://";
    if (document.domain === "localhost") return protocol + "127.0.0.1:8000/ws";
    return protocol + document.location.host + "/ws";
}

export const projectURLS = {
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
            link: projectURLS.chat,
        },
        {
            label: 'Contests',
            link: projectURLS.contests,
            sub: [
                {
                    label: 'Contest List',
                    link: projectURLS.contests,
                },
                {
                    label: 'Submissions',
                    link: projectURLS.submissions,
                },
                {
                    label: 'Standing',
                    link: projectURLS.standing,
                },
            ]
        },
        {
            label: 'Tutorials',
            link: projectURLS.tutorials,
        },
        {
            label: 'Codeforces',
            link: projectURLS.cf,
            sub: [
                {
                    label: 'Problems',
                    link: projectURLS.cfProblems
                },
                {
                    label: 'Statics',
                    link: projectURLS.cfStatics
                }
            ]
        }
    ],

    menuRight: [
        {
            label: 'Login',
            link: projectURLS.login,
            // class: css.navSuccessButton,
        },
        {
            label: 'Register',
            link: projectURLS.register,
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

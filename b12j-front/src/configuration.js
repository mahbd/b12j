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
    else return  document.location.protocol + "//" + document.location.host + "/api"
}

export const apiEndpoint = apiURL();

export const wssURL = () => {
    const protocol = document.location.protocol === "https:" ? "wss://" : "ws://";
    if (document.domain === "localhost") return protocol + "127.0.0.1:8000/ws";
    return  protocol + document.location.host + "/ws";
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
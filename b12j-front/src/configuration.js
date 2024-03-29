const getEndpoint = () => {
    if (process.env.BACK_END)
        return `https://${process.env.BACK_END}`;
    const protocol = document.location.protocol === "https:" ? "https://" : "http://";
    const port = document.location.port ? ":" + document.location.port : "";
    const domain = document.domain;
      if (domain === "localhost") {
         return "http://localhost:8000";
      }
    return protocol + domain + port;
};

export const endpoint = getEndpoint();
export const apiEndpoint = endpoint + "/api";

export const wssURL = () => {
    const protocol = document.location.protocol === "https:" ? "wss://" : "ws://";
    if (process.env.BACK_END) {
        return `wss://${process.env.BACK_END}`;
    }
    if (document.location.hostname === "localhost") {
         return "ws://localhost:8000/ws";
    }
    return protocol + document.domain + (document.location.port ? ":" + document.location.port : "") + "/ws";
};

const mainUrls = {
    chat: "/chat",
    home: "/home",
    contests: "/contests",
    others: "/others",
    problems: "/problems",
    restricted: "/restricted",
    submissions: "/submissions",
    tutorials: "/tutorials",
    users: "/users"
};

const subUrls = {
    addContest: `${mainUrls.contests}/add`,
    addProblem: `${mainUrls.problems}/add`,
    addTutorial: `${mainUrls.tutorials}/add`,
    confirmEmail: `${mainUrls.users}/activate`,
    editContest: `${mainUrls.contests}/edit/`,
    editProblem: `${mainUrls.problems}/edit`,
    editTutorial: `${mainUrls.tutorials}/edit`,
    emailSent: `${mainUrls.others}/email-sent`,
    login: `${mainUrls.users}/login`,
    logout: `${mainUrls.users}/logout`,
    privacyPolicy: `${mainUrls.others}/privacy-policy`,
    profile: `${mainUrls.users}/profile`,
    register: `${mainUrls.users}/register`,
    registerSuccess: `${mainUrls.users}/register-success`,
    resetPassword: `${mainUrls.users}/reset-password`,
    resetPasswordConfirm: `${mainUrls.users}/passwordResetConfirm`,
    confirmGoogleAuth: `${mainUrls.users}/confirmGoogleAuth`,
    resendActivationEmail: `${mainUrls.users}/resend-email`,
    testCases: `${mainUrls.problems}/test_cases`,
    addTestCases: `${mainUrls.problems}/test_cases/add`,
    userList: `${mainUrls.users}/users`
};

const profileNav = {
    mainProfile: `${subUrls.profile}/mainProfile`,
    unsolvedProblems: `${subUrls.profile}/unsolvedProblems`,
    profileTutorials: `${subUrls.profile}/tutorials`,
    profileProblems: `${subUrls.profile}/problems`,
    profileSubmissions: `${subUrls.profile}/submissions`,
    profileContests: `${subUrls.profile}/contests`,
    testProblems: `${subUrls.profile}/testProblems`
};

export const urls = {
    cf: "/cf",
    cfProblems: "cf/problems",
    cfStatics: "cf/statics",
    standing: "/contests/standing",
    ...mainUrls,
    ...subUrls,
    ...profileNav
};

export const serverUrls = {
    login: "/auth/jwt/create",
    loginWithGoogle: "/auth/google/token",
    googleAuthURL: "/auth/o/google-oauth2",
    googleAuthConfirmURL: "/auth/o/google-oauth2",
    refreshToken: "/auth/jwt/refresh",
    register: "/auth/users",
    updateUser: "/auth/users/me",
    resendActivationEmail: "/auth/users/resend_activation",
    resetPassword: "/auth/users/reset_password",
    changeUsername: "/auth/users/set_username",
    changePassword: "/auth/users/set_password",
    confirmEmail: "/auth/users/activation",
    resetPasswordConfirm: "/auth/users/reset_password_confirm",
    userList: "/users",
    verifyToken: "/auth/jwt/verify",
    submissions: "/submissions",
    tutorials: "/tutorials",
    problems: "/problems",
    contests: "/contests",
    test_cases: "/test-cases"
};

export const keys = {
    ACCESS: "access",
    REFRESH: "refresh"
};

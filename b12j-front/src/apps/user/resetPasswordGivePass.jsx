import React from "react";
import ResetPasswordForm from "../../components/forms/resetPasswordForm";

const ResetPasswordGivePass = ({match, history}) => {
  const {uid, token} = match.params;
  return (
    <div>
      {uid && token && <ResetPasswordForm uid={uid} token={token} history={history} />}
    </div>
  );
};

export default ResetPasswordGivePass;
import EmailForm from "../../components/forms/emailForm";
import { startLoading, stopLoading } from "../../components/loadingAnimation";
import httpService from "../../components/httpService";
import { apiEndpoint, serverUrls, urls } from "../../configuration";

class ResetPassword extends EmailForm {
  doSubmit = async () => {
    try {
      startLoading("Sending Password Reset Email");
      await httpService.post(`${apiEndpoint}${serverUrls.resetPassword}/`, { ...this.state.data });
      stopLoading();
      this.props.history.push(urls.emailSent);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors, ...ex.response.data };
        this.setState({ errors });
      }
    }
  };
}

export default ResetPassword;
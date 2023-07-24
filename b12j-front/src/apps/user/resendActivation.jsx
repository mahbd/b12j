import EmailForm from "../../components/forms/emailForm";
import { startLoading, stopLoading } from "../../components/loadingAnimation";
import httpService from "../../components/httpService";
import { apiEndpoint, serverUrls, urls } from "../../configuration";

class ResendActivation extends EmailForm {
  doSubmit = async () => {
    try {
      startLoading("Resending Activation Email");
      await httpService.post(`${apiEndpoint}${serverUrls.resendActivationEmail}/`, { ...this.state.data });
      stopLoading();
      this.props.history.push(urls.registerSuccess);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors, ...ex.response.data };
        this.setState({ errors });
      }
    }
  };
}

export default ResendActivation;
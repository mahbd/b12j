const theme = localStorage.getItem('theme') !== "regular";

export const css = {
  heading4: theme ? "bi-heading4 text-center" : "",
  navbar: theme ? "navbar navbar-expand-lg navbar-dark bg-dark" : "",
  tableSingle: theme ? "table table-bordered border-dark table-striped table-hover text-center" : "",
}
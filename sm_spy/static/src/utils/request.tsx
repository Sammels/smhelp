import axios from 'axios';


export default axios.create({
  timeout: 5000,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken'
});

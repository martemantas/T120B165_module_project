import { jwtDecode } from 'jwt-decode';

const Auth = () => {
    if(localStorage.getItem('token')){
        return jwtDecode(localStorage.getItem('token')) ;
    }
    return null;
};

export default Auth;

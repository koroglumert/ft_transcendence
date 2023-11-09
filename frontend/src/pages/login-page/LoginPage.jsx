import React from "react";
import './LoginPage.css'
import AuthorizeButton from '../../components/AuthorizeButton';
import Cookies from 'universal-cookie';
import PreLoader from "../../components/PreLoader";
import logo from '../../assets/logo.png';
import Footer from "../../components/Footer";
import { BACK_URL, FRONT_URL } from "../../env";

function parseQueryString(url) {
    // URL'den ? işaretinden sonraki kısmı alın
    const queryString = url.split('?')[1];
    if (!queryString) {
        return {};
    }

    // Parametreleri ayırın
    const params = queryString.split('&');
    const result = {};

    for (const param of params) {
        const [key, value] = param.split('=');
        result[key] = value;
    }
    return result;
}

const LoginPage = () => {

    const search = window.location.search;
    let code;
    let state;

    if (search) {
        const parsedParams = parseQueryString(search);
        code = parsedParams.code;
        state = parsedParams.state;

        // GET isteği yapılacak URL'i buraya girin
        const baseUrl = `${BACK_URL}/api/42api/data`;
        // Parametreleri URL'ye ekleyin
        const requestURL = `${baseUrl}?code=${code}&state=${state}`;

        fetch(requestURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Verileri kullanmak için burada işlem yapabilirsiniz
                const cookies = new Cookies();
                cookies.set('data', data);
                window.location.href = `${FRONT_URL}/MainPage`
            })
            .catch(error => {
                console.error('Hata oluştu:', error);
            });
    }

    return (
        !search ? (
            <section className="section1">
                <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                <div className="signin">
                    <div className="content">
                        <img className="banner" src={logo} alt="banner" />
                        <div className="form">
                            <div className="inputBox">
                                <AuthorizeButton />
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div>
            </section>
        )
            : (
                <section className="section1" style={{ backgroundColor: "#000" }}>
                    <div className="content">
                        <PreLoader />
                    </div>
                </section>
            )
    );
}

export default LoginPage;
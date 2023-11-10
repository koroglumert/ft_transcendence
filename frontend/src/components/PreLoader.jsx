import ReactLoading from 'https://cdn.skypack.dev/react-loading@2.0.3';
import React, { useState, useEffect } from 'react';

function PreLoader() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            window.location.href = "/LoginPage";
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && (
                <ReactLoading
                    type={'cylon'}
                    color={"#0f0"}
                    height={100}
                    width={100}
                />
            )}
        </>
    );

};

export default PreLoader;
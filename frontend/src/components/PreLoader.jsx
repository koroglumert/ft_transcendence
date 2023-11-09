import ReactLoading from 'https://cdn.skypack.dev/react-loading@2.0.3';

function PreLoader() {

    return(
        <>
            <ReactLoading
            type={'cylon'}
            color={"#0f0"}
            height={100}
            width={100}
            />
        </>
    );
};

export default PreLoader;
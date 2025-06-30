const Loader: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.spinner}></div>
        </div>
    )
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'loadingFade 150ms forwards'
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid transparent",
        borderTop: "4px solid #84cc16",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};

export default Loader
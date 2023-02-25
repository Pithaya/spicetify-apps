import styles from './css/app.module.scss';
import React from 'react';
import { Header } from './components/header.component';

function App() {
    return (
        <>
            <div className={styles.container}>
                <Header></Header>
            </div>
        </>
    );
}

export default App;
